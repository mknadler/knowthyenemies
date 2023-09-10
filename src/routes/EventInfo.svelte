<script>
import { afterUpdate } from 'svelte';
import Checkbox from '$components/Checkbox.svelte';
import PlayerRow from './PlayerRow.svelte';

export let searchForm;
export let searchedEvent;
export let players;
export let arenas;

let colorize = true;

afterUpdate(() => {
	searchForm.scrollIntoView({behavior: 'smooth'});
});

</script>

<h2>{searchedEvent.name}</h2>

{#if arenas}
	<div class="example">
	<p>How to read: 
		<span class="example__wrapper">
			<span class="example__average">1.5</span><span class="example__count">3</span>
		</span> 
		means "averaged 1.5th place across 3 games"
	</p>
	</div>

	<div class="table-filters">
		<Checkbox checkboxLabel="Colorize results" bind:checked={colorize}></Checkbox>
	</div>

	<table class:colorize={colorize}>
		<thead>
		<th>Player</th>
		{#each arenas as arena}
			<th data-name="{arena.name}">{arena.shortname}</th>
		{/each}
		</thead>
		<tbody>
		{#each players as player}
			<PlayerRow player={player} arenas={arenas} />
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
		right: 2px;
		width: max-content;
		z-index: 4;
	}

	.example {
		font-family: var(--font-table);
		font-size: 13px;
	}
	.example p {
		line-height: 2;
	}
	.example__wrapper {
		display: inline-block;
	}
	.example__average, .example__count {
		padding: 4px;
		border: 1px solid var(--color-accents);
	}
	.example__average {
		background: #3f3350;
		border-right: none;
	}
	.example__count {
		background: #251638;
		border-left: none;
	}
	.table-filters {
		margin-top: 2rem;
	}

	.table-filters label:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.table-filters [type="checkbox"] {
		background: transparent;
		appearance: none;
		position: relative;
		transform: translateY(6px);
	}

	.table-filters [type="checkbox"]:focus-within {
		appearance: none;
	}

	.table-filters [type="checkbox"]:focus:before {
		outline: 1px solid var(--color-accents);
		outline-offset: 2px;
	}

	.table-filters [type="checkbox"]:before {
		content: '';
		width: 16px;
		height: 16px;
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		border: 1px solid var(--color-accents);
	}


	.table-filters [type="checkbox"]:hover {
		cursor: pointer;
	}

	.table-filters [type="checkbox"]:checked:before {
		content: 'x';
		text-align: center;
		line-height: .75;
	}

</style>