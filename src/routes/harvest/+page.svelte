<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { format } from 'date-fns';

	export let data;

	let lastUpdated = new Date();

	let tData, mainArenas, womensArenas, allPlayers, mainQueues, womensQueues

	const structureTournamentData = () => {
	if (data?.allData) {
			let all = data.allData;
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

Auto-updates every few seconds. Last updated: {format(lastUpdated, 'pp')}

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

	.links {
		padding: 2rem;
		position: sticky;
		top: 0;
		background: var(--color-background);
		z-index: 1;
		border-bottom: 1px solid #eee;

		& a {
			display: block;
			margin-top: .5rem;
		}
	}
</style>