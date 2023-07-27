import shortnames from '$lib/shortnames.json';

export function getOrGenerateShortname(opdbId, name) {
	let shortnameInJSON = shortnames.find(entry => entry.opdb_id === opdbId);
	if (shortnameInJSON) {
		return shortnameInJSON.shortname;
	} else {
		return name.substring(0,3) + '..';
	}
}