<script>
	import { onMount } from 'svelte';

	import { format } from 'date-fns';

	export let data;

	onMount(() => {

	});

	let queues, mainTournament, womensTournament, classicsTournament;

	let tData = data.allData;

	let mainArenas = tData.main.data.arenas;
	let womensArenas = tData.main.data.arenas;

	
	mainArenas = mainArenas.filter(arena => arena.status === "active");

	let allPlayers = tData.main.data.players;
	let mainQueues = tData.mainQueues.data;
	let womensQueues = tData.womensQueues.data;
	mainArenas.forEach(arena => {
		arena.queue = mainQueues[arena.arenaId]
		arena.womensQueue = womensQueues[arena.arenaId]
	})

	console.log("womens arenas", womensArenas)

	console.log("mqueue", mainQueues)
	console.log("players", allPlayers)
	console.log("Womens", womensQueues)

	const playerFromId = (id) => {
		return allPlayers.find(player => {
			return +player.playerId == id
		})
	}
</script>

<h1>Harvest</h1>
{#each mainArenas as arena}
	<div class="arena-card">
		<h2>{arena.name}</h2>
		<div class="queues">
			<div class="queues__queue">
				<h3>Open <a href={`https://app.matchplay.events/tournaments/208626/arenas/${arena.arenaId}`}>URL</a></h3>
				{#if arena.queue}
					<ol>
						{#each arena.queue as queuedPlayer, i}
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
{/each}

<style>
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

	li.finished {
		text-decoration: line-through;
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
</style>