import { matchplay_config, opdb_config } from '../config';
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { RateLimit } from 'async-sema';

const limit = RateLimit(1);

const matchplayHeaders = {
	'Authorization': `Bearer ${matchplay_config.apiKey}`,
	'Content-Type': 'application/json',
	'Accept': 'application/json'
}

const onlyDigitsRegExp = new RegExp('^[0-9]+$');
const matchplaySeriesURLRegex = /(?:app\.matchplay\.events\/(?:live\/)*series\/)(\d{1,})/;
const matchplayTournamentURLRegex = /(?:app\.matchplay\.events\/(?:live\/)*tournaments\/)(\d{1,})/;

const getCatFacts = async() => {

    throw fail(429);
    /*
    let facts = [];
    const fetchFromApi = () => {
        const url = 'https://catfact.ninaja/facxzt';

        const response = fetch(url)
            .then(response => { return response.json()}).catch(err => {
                return err;
                throw err;
            })
        return response;
    }


    let nums = [1,2,3,4,5]
    for (var value of nums) {
        let thisLimit = await limit();

        fetchFromApi().then(result => {
            facts.push(result);
        }).catch(error => {
            console.log("ERror!!");
            throw new Error()
            throw new Error();
        })
    }
    return facts;*/
} 

export const actions = {
	getEvent: async ({ request }) => {

        // return fail(429)

        try {
            let facts = await getCatFacts();
        } catch(error) {
            console.log('meow', error)
            return fail(error.status)
        }



        
		let errorMessage = '';
		try {
            console.log("Starting get event");
			// new belles: 2827. last belles: 2735
			// tournaments: 109548, 109549
			let data = await request.formData();
			let mode = data.get('eventType');
			let eventId = data.get('eventId');

            console.log("id", eventId);

			if (mode === 'series') {
				if (!eventId || !onlyDigitsRegExp.test(eventId)) {
					let parsedURL = eventId.match(matchplaySeriesURLRegex);
					if (parsedURL && parsedURL[1]) {
						eventId = parsedURL[1]
					} else {
						return fail(400, { eventId, invalid: true });
					}
				}
                console.log("fetching 1");
				const seriesResponse = await fetchMatchplay(`series/${eventId}`, {includeDetails: true});
				const seriesResponseJson = await seriesResponse.json();
                console.log("did fetch 1");

				const tournamentURLs = seriesResponseJson.data.tournamentIds.map(id => {
					return new URL(`https://app.matchplay.events/api/tournaments/${id}/games`)
				});
				const arenaURLs = seriesResponseJson.data.tournamentIds.map(id => {
					return new URL(`https://app.matchplay.events/api/tournaments/${id}`)
				});

				const getAllTournaments = async() => {
					try {
						const response = await Promise.all(
							tournamentURLs.map(url => {
                                console.log('trying fetch for', url);
								return fetch(url, {matchplayHeaders}).then(res => res.json())
							})
						);

                        console.log("did fetches")
						return response
					}
					catch (error) {
                        console.log('error1');
						return fail(400, { eventId });
						throw new Error('Matchplay tournaments request failed');
					}
				}

				const getAllArenas = async() => {
					try {
                        let arenas = [];
                        const delay = 1;
                        for (let i = 0; i < arenaURLs.length; i++) {
                            setTimeout(() => {
                                try {
                                    arenaURLs[i].searchParams.append('includeArenas, true');
                                    let arenaResponse = fetch(arenaURLs[i], {matchplayHeaders});
                                    arenas.push(arenaResponse.json())
                                } 
                                catch {

                                }
                            }, delay * i)



                            let arenaPromise = new Promise(async function(resolve, reject) {
                                await new Promise(res => setTimeout(res, delay));

                                let result = await new Promise(r => {
                                    arenaURLs[i].searchParams.append('includeArenas', true);
                                    r(fetch(arenaURLs[i], {matchplayHeaders}).then(res => {
                                        console.log("RES!", res)
                                        if (res.status === 429) {
                                            error(429);
                                        }
                                        return res.json();
                                    }))
                                }).catch(error => {
                                    console.log("erro!@!@", error);
                                    throw fail(429);
                                })

                                resolve(result);
                            });
                            arenaPromises.push(arenaPromise);
                        }
						const response = Promise.all(arenaPromises)
                            .then(response => {
                                return response;
                            })
                            .catch((error) => {
                                console.log("all error", error);
                            });
					}
					catch (error) {
                        console.log('error2', error);
						return fail(400, { eventId });
						throw new Error('Matchplay tournaments request failed');
					}
				}

				const tournamentData = await getAllTournaments();
				const arenasData = await getAllArenas();

				let allArenas = [];

				arenasData.forEach(arenaData => {
					arenaData.data.arenas.forEach(arena => {
						if (!allArenas.find(allArena => allArena.arenaId === arena.arenaId)) {
							allArenas.push(arena);
						}
					})
				})

				return { series: seriesResponseJson.data, tournaments: tournamentData, arenas: allArenas}
			} else if (mode === 'tournament') {
				// TODO: dedupe this + above code
				if (!eventId || !onlyDigitsRegExp.test(eventId)) {
					let parsedURL = eventId.match(matchplayTournamentURLRegex);
					if (parsedURL && parsedURL[1]) {
						eventId = parsedURL[1]
					} else {
                        console.log('error5');
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
                        console.log('error3');
						return fail(400, { eventId })
					}
				}
				const tournamentData = await getAllTournamentData();
				return { tournament: tournamentData[0], tournamentGames: tournamentData[1], tournamentStandings: tournamentData[2] }
			}
		} catch(error) {
            console.log('error4', error);
			return fail(400);
		}
	}
}

async function fetchMatchplay(endpoint, urlParams = {}) {
	const url = new URL(`https://app.matchplay.events/api/${endpoint}`);
	Object.keys(urlParams).forEach(key => url.searchParams.append(key, urlParams[key]));
	const response = await fetch(url, { method: 'GET', matchplayHeaders})

	return response;
}