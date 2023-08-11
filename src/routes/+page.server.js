import { matchplay_config, opdb_config } from '../config';
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

const matchplayHeaders = {
	'Authorization': `Bearer ${matchplay_config.apiKey}`,
	'Content-Type': 'application/json',
	'Accept': 'application/json'
}

const opdbHeaders = {
	'Authorization': `Bearer ${opdb_config.apiKey}`,
	'Content-Type': 'application/json',
	'Accept': 'application/json'
}

const onlyDigitsRegExp = new RegExp('^[0-9]+$');
const matchplaySeriesURLRegex = /(?:matchplay\.events\/(?:live\/)*series\/)(\d{1,})/;
const matchplayTournamentURLRegex = /(?:matchplay\.events\/(?:live\/)*tournaments\/)(\d{1,})/;

export const actions = {
	getEvent: async ({ request }) => {
		let errorMessage = '';
		try {
			// new belles: 2827. last belles: 2735
			// tournaments: 109548, 109549
			let data = await request.formData();
			let mode = data.get('eventType');
			let eventId = data.get('eventId');

			if (mode === 'series') {
				if (!eventId || !onlyDigitsRegExp.test(eventId)) {
					let parsedURL = eventId.match(matchplaySeriesURLRegex);
					if (parsedURL && parsedURL[1]) {
						eventId = parsedURL[1]
					} else {
						return fail(400, { eventId, invalid: true });
					}
				}
				const seriesResponse = await fetchMatchplay(`series/${eventId}`, {includeDetails: true});
				const seriesResponseJson = await seriesResponse.json();

				const tournamentURLs = seriesResponseJson.data.tournamentIds.map(id => {
					return new URL(`https://next.matchplay.events/api/tournaments/${id}/games`)
				});

				const getAllTournaments = async() => {
					try {
						const response = await Promise.all(
							tournamentURLs.map(url => fetch(url, {matchplayHeaders}).then(res => res.json()))
						);
						return response
					}
					catch (error) {
						return fail(400, { eventId });
						throw new Error('Matchplay tournaments request failed');
					}
				}

				const tournamentData = await getAllTournaments();

				return { series: seriesResponseJson.data, tournaments: tournamentData }
			} else if (mode === 'tournament') {
				// TODO: dedupe this + above code
				if (!eventId || !onlyDigitsRegExp.test(eventId)) {
					let parsedURL = eventId.match(matchplayTournamentURLRegex);
					if (parsedURL && parsedURL[1]) {
						eventId = parsedURL[1]
					} else {
						return fail(400, { eventId, invalid: true });
					}
				}

				const tournamentResponse = await fetchMatchplay(`tournaments/${eventId}/games`, {
					includePlayers: true, 
					includeArenas: true
				});

				const getAllTournamentData = async() => {
					try {
						const response = await Promise.all(
							[
								fetchMatchplay(`tournaments/${eventId}`, {
									includePlayers: true, includeArenas: true
								}).then(res => res.json()),
								fetchMatchplay(`tournaments/${eventId}/games`).then(res => res.json()),
								fetchMatchplay(`tournaments/${eventId}/standings`).then(res => res.json())
							]
						);
						return response;
					} catch(err) {
						return fail(400, { eventId })
					}
				}
				const tournamentData = await getAllTournamentData();
				return { tournament: tournamentData[0], tournamentGames: tournamentData[1], tournamentStandings: tournamentData[2] }
			}
		} catch(error) {
			return fail(400);
		}
	}
}

async function fetchMatchplay(endpoint, urlParams = {}) {
	const url = new URL(`https://next.matchplay.events/api/${endpoint}`);
	Object.keys(urlParams).forEach(key => url.searchParams.append(key, urlParams[key]));

	const response = await fetch(url, { method: 'GET', matchplayHeaders})

	return response;
}