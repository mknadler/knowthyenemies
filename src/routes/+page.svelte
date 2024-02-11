<script>
	import { enhance } from '$app/forms';
	import { Player, Arena } from '$lib/classes.js'
	import { getOrGenerateShortname as getShortname } from '$lib/getOrGenerateShortnames.js'
	import { processSeriesData } from '$lib/scripts/processSeriesData.js';
	import { processTournamentData } from '$lib/scripts/processTournamentData.js';

	import RadioGroup from '$components/RadioGroup.svelte';

	import EventInfo from './EventInfo.svelte'

	export let form;

	let searchForm;
	let searchedEvent;
	let players = [];
	let arenas = [];
	let seriesArenas = [];

	let isLoading = false;
	let errorMsg = '';

	let tournamentMode = false;
	let eventType = 'tournament';

	const processEventData = (data) => {
		players.forEach(player => {
			player.reset();
		})
		arenas = [];
		players = [];

		if (data.tournament) {
			processTournamentData(data, players, arenas);
		} else {
			processSeriesData(data, players, arenas);
		}
	}

	function reset() {
		arenas = [];
		searchedEvent = [];
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
			processEventData(data);
		})
	}

	let eventTypes = [
		{label: 'Series', value: 'series'},
		{label: 'Tournament', value: 'tournament'}
	]

</script>

<svelte:head>
	<title>Know Thy Enemies</title>
	<meta name="description" content="Pinball series results analysis" />
</svelte:head>

<section>
	<h1>Know thy enemies</h1>
	<section class="about">
		<div class="about__section">
			<span>What is this?</span><p>A tool for pinball players to see how well different players did on certain machines during a tournament or series (group of tournaments) run through <a href="https://next.matchplay.events/">MatchPlay</a>. If you don't use MatchPlay but want to check this out, try the series id '2735' or the tournament id '91132`.</p>
		</div>
		<div class="about__section">
			<span>Who made this?</span><p><a href="https://miri.page">Miriam Nadler</a>. You can see the code <a href="https://github.com/mknadler/knowthyenemies">here</a>. For feedback, open an issue on GitHub or use the contact form on my personal site.</p>
		</div>
		<div class="about__section">
			<span>What's next?</span><p>I plan on adding filtering and sorting options as well as more granular views of data.</p>
		</div>
	</section>
	
	
	<form 
		bind:this={searchForm}
		method="POST" 
		action="?/getEvent"
		use:enhance={() => {
			return ({result, error}) => {
				if (result.status === 200) {
					resetAndPopulate(result.data);
					searchedEvent = result.data.series || result.data.tournament.data;
				} else if (result.status === 400) {
					errorMsg = 'Series ID invalid'
				} else {
					errorMsg = 'Something went wrong. Please try again.'
				}
			}
		}}
	>

		<RadioGroup groupLabel="Select event type" name="eventType" radioList={eventTypes} bind:selectedRadio={eventType}></RadioGroup>

		<div class="form-controls">
			<div class="buttoned-input">
				<label for="seriesIdInput">MatchPlay {#if eventType === 'tournament'}Tournament{:else}Series{/if}</label>
				<div class="buttoned-input__controls">
					<input type="text" name="eventId" id="seriesIdInput" placeholder="ID or URL"/>
					<button class="button--primary" type="submit">Get data</button>
				</div>
		  	</div>
		  </div>
	</form>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}

	{#if searchedEvent && (searchedEvent.seriesId || searchedEvent.tournamentId) && arenas}
		<EventInfo searchForm={searchForm} searchedEvent={searchedEvent} players={players} arenas={arenas}/>
	{/if}
</section>

<style>
	.error {
		margin-top: 1rem;
	}
</style>
