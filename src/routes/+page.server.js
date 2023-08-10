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
const matchplayURLRegex = /(?:matchplay\.events\/(?:live\/)*series\/)(\d{1,})/;

export const actions = {
	getTournaments: async ({ request }) => {
		let errorMessage = '';
		try {
			// new belles: 2827. last belles: 2735
			let data = await request.formData();
			let seriesId = data.get('seriesId');
			if (!seriesId || !onlyDigitsRegExp.test(seriesId)) {
				let parsedURL = seriesId.match(matchplayURLRegex);
				if (parsedURL && parsedURL[1]) {
					seriesId = parsedURL[1]
				} else {
					return fail(400, { seriesId, invalid: true });
				}
			}
			const seriesResponse = await fetchMatchplay(`series/${seriesId}`, {includeDetails: true});
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
					return fail(400, { seriesId });
					throw new Error('Matchplay tournaments request failed');
				}
			}

			const tournamentData = await getAllTournaments();

			return { series: seriesResponseJson.data, tournaments: tournamentData }
		} catch(error) {
			return fail(400, { seriesId });
		}
	}
}

async function fetchMatchplay(endpoint, urlParams = {}) {
	const url = new URL(`https://next.matchplay.events/api/${endpoint}`);
	Object.keys(urlParams).forEach(key => url.searchParams.append(key, urlParams[key]));

	const response = await fetch(url, { method: 'GET', matchplayHeaders})

	return response;
}