<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { format } from 'date-fns';

	export let data;

	let lastUpdated = new Date();

	let tData, mainArenas, womensArenas, allPlayers, mainQueues, womensQueues

	const structureTournamentData = () => {
		console.log("Fired", data);
		if (data?.allData) {
		let all = data.allData;
		if (!all.main || !all.womensQueues || !all.mainQueues) {
			return;
		}
		mainArenas = all.main.data.arenas;
		womensArenas = all.main.data.arenas;

		
		mainArenas = mainArenas.filter(arena => arena.status === "active");

		allPlayers = all.main.data.players;
		mainQueues = all.mainQueues.data;
		womensQueues = all.womensQueues.data;
		mainArenas.forEach(arena => {
			arena.queue = mainQueues[arena.arenaId]
			arena.womensQueue = womensQueues[arena.arenaId]
		})

		lastUpdated = new Date();

		}
	}

	onMount(() => {
		structureTournamentData();
		(function loop() {
		  setTimeout(() => {
		    structureTournamentData();
		    invalidateAll();
		    loop();
		  }, 3000);
		})();

	});

	let queues, mainTournament, womensTournament, classicsTournament;

	const playerFromId = (id) => {
		return allPlayers.find(player => {
			return +player.playerId == id
		})
	}
</script>

<h1>Harvest</h1>

<div class="auto">Auto-updates every few seconds. <br/>Last updated: {format(lastUpdated, 'pp')}. <br/>If this stops updating, reload.</div>

<div class="links">
	<h2>Links</h2>
	<a href="https://app.matchplay.events/tournaments/208626/">Harvest (Open)</a>
	<a href="https://app.matchplay.events/tournaments/214406">Harvest (Classics)</a>
	<a href="https://app.matchplay.events/tournaments/217814">They/hervest</a>
</div>
{#if mainArenas}
	{#each mainArenas as arena}
		{#if !arena}
			Error: Arena not found
		{:else}
			<div class="arena-card">
				<h2>{arena.name}</h2>
				<div class="queues">
					<div class="queues__queue">
						<h3>Open <a href={`https://app.matchplay.events/tournaments/208626/arenas/${arena.arenaId}`}>URL</a></h3>
						{#if arena.queue}
							<ol>
								{#each arena?.queue as queuedPlayer, i}
									<li class={`${queuedPlayer.completedAt === null ? '' : 'finished'}`}>
										{#if queuedPlayer && playerFromId(queuedPlayer.playerId)?.name}
											{playerFromId(queuedPlayer.playerId).name}<br/>
										{:else}
											Player name not found
										{/if}
										{#if queuedPlayer?.createdAt}
											{format(queuedPlayer.createdAt, 'hh:mm:ss')}
										{:else}
											Queue join time not found
										{/if}
									</li>
								{/each}
							</ol>
						{:else}
							<span>Empty</span>
						{/if}
					</div>
					<div class="queues__queue">
						<h3>Womens <a href={`https://app.matchplay.events/tournaments/217814/arenas/${arena.arenaId}`}>URL</a></h3>
						{#if arena.womensQueue}
							<ol>
								{#each arena.womensQueue as queuedPlayer, i}
									<li class={`${queuedPlayer.completedAt === null ? '' : 'finished'}`}>
										{playerFromId(queuedPlayer.playerId).name}<br/>
										{format(queuedPlayer.createdAt, 'hh:mm:ss')}
									</li>
								{/each}
							</ol>
						{:else}
							<span>Empty</span>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/each}
{:else}
	<div class="loading">
		<span>Loading...</span>
		<div class="box-1"></div>
		<div class="box-2"></div>
	</div>
{/if}

<style>
	h1 {
		font-weight: 600;
	}

	.arena-card {
		display: block;
		border: 1px dotted #ff0066;
		padding: 24px;
	}

	li {
		font-family: "Space Mono";
		font-size: 14px;
	}

	.queues {
		display: flex;
		flex-wrap: wrap;
	}

	.queues__queue {
		background: rgba(255, 255, 255, .1);
		flex-basis: 50%;
		padding: 16px;
	}

	.queues__queue span {
		display: block;
		margin-top: 1rem;
		font-style: italic;
		opacity: .8;
	}

	@media (max-width: 500px) {
		.queues__queue {
			flex-grow: 1;
			flex-basis: 100%;
		}
		.queues__queue:nth-child(2) {
			margin-top: .5rem;
		}
	}

	h3 {
		font-size: 16px;
	}

	.auto {
		position: sticky;
		top: 0;
		background: var(--color-background);
		z-index: 1;
		padding: 1rem 0;
	}

	.links {
		padding: 2rem;
		border-bottom: 1px solid #eee;

		& a {
			display: block;
			margin-top: .5rem;
		}
	}

	.loading {
		border: 1px solid var(--color-medpink);
		padding: 2rem 2rem 4rem 2rem;
		margin-top: 1rem;
		text-align: center;
		position: relative;


	}
	.box-1 {
		display: block;
		position: absolute;
		width: 20px;
		height: 20px;
		top: 1rem;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: var(--color-accents);
		animation: moveIt 2s ease-in-out infinite alternate;
	}
	.box-2 {
		display: block;
		position: absolute;
		width: 20px;
		height: 20px;
		top: 1rem;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: var(--color-medpink);
		animation: moveItOtherWay 2s ease-in-out infinite alternate;
	}
	@keyframes moveIt {
		0% {
			transform: translateX(0);
			border-radius: 0%;
		}
		100% {
			transform: translateX(1rem);
			border-radius: 50%;
		}
	}
	@keyframes moveItOtherWay {
		0% {
			transform: translateX(0);
			border-radius: 0%;
		}
		100% {
			transform: translateX(-1rem);
			border-radius: 50%;
		}
	}
</style>