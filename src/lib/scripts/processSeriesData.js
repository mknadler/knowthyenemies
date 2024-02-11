import { Player, Arena } from '$lib/classes.js';
import { getOrGenerateShortname as getShortname } from '$lib/getOrGenerateShortnames.js';


export const processSeriesData = ((data, players, arenas) => {
	// Generate list of unique games in tournament

	let allArenas = data.arenas;

	data.tournaments.forEach((tournament, tIndex) => {
		let games = tournament.data;
		games.forEach((game, gIndex) => {
			let thisArena = allArenas.find(allArena => allArena.arenaId === game.arenaId);
			game.arena = thisArena
			data.tournaments[tIndex].data[gIndex].arena = thisArena;
			if (!arenas.find(arena => arena.opdbId === game.arena.opdbId)) {
				arenas.push(new Arena(game.arena.name, game.arena.opdbId, getShortname(game.arena.opdbId, game.arena.name), game.arena.arenaId));
			}
		})
	})

	// Instantiate players list
	data.series.players.forEach(player => {
		let standingInSeries = data.series.standings.find(standing => standing.playerId === player.playerId).position
		players.push(new Player(player.name, player.playerId, standingInSeries));
	})

	// Sort by standing
	players.sort((a, b) => a.standing - b.standing);

	// Iterate over each game's ordered results array
	// and use that to register the placement on each Player instance
	data.tournaments.forEach(tournament => {
		let games = tournament.data;
		games.forEach(game => {
			let thisArena = arenas.find(arena => arena.arenaId === game.arenaId);
			game.arena = thisArena
			game.resultPositions.forEach((position, index) => {
				let thisPlayer = players.find(player => position === player.id)
				thisPlayer.result = {
					arena: thisArena,
					place: index + 1 
				};
			})
		})
	})
	
	return {players, arenas};

});