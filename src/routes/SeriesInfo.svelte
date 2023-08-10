<script>
export let series;
export let players;
export let arenas;

import PlayerRow from './PlayerRow.svelte'

</script>

<h2>{series.name}</h2>

{#if arenas}
	<div class="example" style="display: none;">
	<p>Legend: <span><span>1.5</span><span>3</span></span> means "averaged 1.5th place across 3 games"</p>
	</div>

	<table>
		<thead>
		<th>Player</th>
		{#each arenas as arena}
			<th data-name="{arena.name}">{arena.shortname}</th>
		{/each}
		</thead>
		<tbody>
		{#each players as player}
			<PlayerRow player={player} arenas={arenas}/>
		{/each}
		</tbody>
	</table>
{/if}

<style>
	h2 {
		margin-top: 3rem;
	}
	th[data-name]:before {
		content: attr(data-name);
		display: none;
	}
	th[data-name]:hover:before {
		display: block;
		position: absolute;
		top: -1.5rem;
		text-align: right;
		right: 0;
		width: max-content;
		z-index: 4;

	}
</style>