import { matchplay_config, opdb_config } from '../../config';
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { RateLimit } from 'async-sema';
import { harvestData } from './harvestStore.js';

const harvestMainId = '208626';
const harvestWomensId = '217814';
const harvestClassicsId = 214406;


const limit = RateLimit(1);

const matchplayHeaders = {
	'Authorization': `Bearer ${matchplay_config.apiKey}`,
	'Content-Type': 'application/json',
	'Accept': 'application/json'
}


const getMainData = async() => {
	const mainTournament = await fetchMatchplay(`tournaments/${harvestMainId}`, {includePlayers: true, includeArenas: true, includePlayoffs: true, includeShortcut: true});
	const womensTournament = await fetchMatchplay(`tournaments/${harvestWomensId}`, {includePlayers: true, includeArenas: true, includePlayoffs: true, includeShortcut: true});
	const classicsTournament = await fetchMatchplay(`tournaments/${harvestClassicsId}`, {includePlayers: true, includeArenas: true, includePlayoffs: true, includeShortcut: true});
	const mainQueues = await fetchMatchplay(`tournaments/${harvestMainId}/queues`);
	const womensQueues = await fetchMatchplay(`tournaments/${harvestWomensId}/queues`);
	const classicQueues = await fetchMatchplay(`tournaments/${harvestClassicsId}/queues`);
	return {
		main: mainTournament, womens: womensTournament, classics: classicsTournament,
		mainQueues: mainQueues, womensQueues: womensQueues, classicsQueues: classicQueues
	};
}

export const load = async({ params }) => {

	const allData = getMainData().then(data => {
		return data;
	})
	return {
		allData
	};
};


async function fetchMatchplay(endpoint, urlParams = {}) {
	const url = new URL(`https://app.matchplay.events/api/${endpoint}`);
	Object.keys(urlParams).forEach(key => url.searchParams.append(key, urlParams[key]));
	const response = await fetch(url, { method: 'GET', matchplayHeaders}).then(response => response.json());

	return response;
}