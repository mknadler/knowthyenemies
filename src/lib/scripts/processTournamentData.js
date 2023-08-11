import { Player, Arena } from '$lib/classes.js';
import { getOrGenerateShortname as getShortname } from '$lib/getOrGenerateShortnames.js';


export const processTournamentData = ((data, players, arenas) => {
	let arenasInTournament = data.tournament.data.arenas;
	
		arenasInTournament.forEach(tournArena => {
			if (!arenas.find(arena => arena.opdbId === tournArena.opdbId)) {
				arenas.push(new Arena(tournArena.name, tournArena.opdbId, getShortname(tournArena.opdbId, tournArena.name)));
			}
		})

	const standings = data.tournamentStandings;

	// Instantiate players list
	data.tournament.data.players.forEach(player => {
		// Existence check to prune inactive players who appear in players list
		// but have 0 games played
		let standing = standings.find(standing => standing.playerId === player.playerId)?.position
		if (standing) { 
			players.push(new Player(player.name, player.playerId, standing));
		}
	})

	// Sort by standing
	players.sort((a, b) => a.standing - b.standing);

	// Iterate over each game's ordered results array
	// and use that to register the placement on each Player instance
	data.tournamentGames.data.forEach(game => {
		game.resultPositions.forEach((position, index) => {
			let thisPlayer = players.find(player => position === player.id)
			thisPlayer.result = {
				arena: game.arena,
				place: index + 1 
			};
		})
	})

	return {players, arenas};
});