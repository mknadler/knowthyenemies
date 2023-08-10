<script>
	import { enhance } from '$app/forms';

	import { Player, Arena } from '$lib/classes.js'

	import { getOrGenerateShortname as getShortname } from '$lib/getOrGenerateShortnames.js';

	import SeriesInfo from './SeriesInfo.svelte'

	export let form;

	let series;
	let players = [];
	let arenas = [];

	let isLoading = false;
	let errorMsg = '';


	const processSeriesData = (data) => {
		// Generate list of unique games in tournament

		players.forEach(player => {
			player.reset();
		})

		arenas = [];
		players = [];
		data.tournaments.forEach(tournament => {
			let games = tournament.data;
			games.forEach(game => {
				if (!arenas.find(arena => arena.opdbId === game.arena.opdbId)) {
					arenas.push(new Arena(game.arena.name, game.arena.opdbId, getShortname(game.arena.opdbId, game.arena.name)));
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
				game.resultPositions.forEach((position, index) => {
					let thisPlayer = players.find(player => position === player.id)
					thisPlayer.result = {
						arena: game.arena,
						place: index + 1 
					};
				})
			})
		})
	}

	function reset() {
		arenas = [];
		series = [];
		players = [];
		errorMsg = '';
		return new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, 100)
		});
	}

	async function resetAndPopulate(data) {
		await reset().then(res => {
			processSeriesData(data);
		})
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Know thy enemies</h1>
	<section class="about">
		<div class="about__section">
			<span>What is this?</span><p>A tool for pinball players to see how well different players did on certain machines during a series (group of tournaments) run through <a href="https://next.matchplay.events/">MatchPlay</a>. If you don't have a MatchPlay series id handy but want to try this out, use '2735'.</p>
		</div>
		<div class="about__section">
			<span>Who made this?</span><p><a href="https://miri.page">Miriam Nadler</a>. You can see the code <a href="https://github.com/mknadler/knowthyenemies">here</a>. For feedback, open an issue on GitHub or use the contact form on my personal site.</p>
		</div>
		<div class="about__section">
			<span>What's next?</span><p>I plan on adding filtering and sorting options as well as more granular views of data.</p>
		</div>
	</section>
	
	
	<form 
		method="POST" 
		action="?/getTournaments"
		use:enhance={() => {
			return ({result, error}) => {
				if (result.status === 200) {
					resetAndPopulate(result.data);
					series = result.data.series;
				} else if (result.status === 400) {
					errorMsg = 'Series ID invalid'
				} else {
					errorMsg = 'Something went wrong. Please try again.'
				}
			}
		}}
	>
		<div class="form-controls">
			<div class="buttoned-input">
				<label for="seriesIdInput">MatchPlay Series</label>
				<div class="buttoned-input__controls">
					<input type="text" name="seriesId" id="seriesIdInput" placeholder="ID or URL"/>
					<button class="button--primary" type="submit">Get data</button>
				</div>
		  	</div>

		  	<!--
		  	<div class="example-button">
		  		<button class="button--secondary" type="button" name="example" on-click={}>See an example</button>
		  	</div> -->
		  </div>
	</form>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	{#if series && series.seriesId && arenas}
		<SeriesInfo series={series} players={players} arenas={arenas}/>
	{/if}
</section>

<style>
	.error {
		margin-top: 1rem;
	}
</style>
