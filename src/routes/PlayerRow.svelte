<script>
export let player;
export let arenas;


let arenaPlaces = [];

arenas.forEach(arena => {
	let thisPlayerPlaces = player.results.filter(result => result.arena.opdbId === arena.opdbId);
	let placesOnly = thisPlayerPlaces.map(thisPlayerPlace => thisPlayerPlace.place);
	let placesCount = placesOnly.length;
	let placesAverageRaw = placesCount ? placesOnly.reduce((sum, num) => sum + num)/placesCount : 0;
	let placesAverage = Number.parseFloat(placesAverageRaw).toFixed(1);
	
	arenaPlaces.push({count: placesCount, avg: placesAverage});
})

function quality(avg) {
	if (avg < 2) {
		return `good`
	} else if (avg < 3) {
		return `ok`
	} else {
		return `bad`
	}	
}


</script>

<tr>
	<td>{player.standing}: {player.name}</td>
	{#each arenaPlaces as arena}
		{#if arena.count === 0}
			<td> <div class="result-cell" data-arena="{arena.name}">
				<span class="result-cell__avg"></span><span class="result-cell__count"></span>
			</div>
			</td>
		{:else}
			<td>
				<div class="result-cell {quality(arena.avg)}"  data-arena="{arena.name}">
					<span class="result-cell__avg">{arena.avg}</span><span class="result-cell__count">{arena.count}</span>
				</div>
			</td>
		{/if}
	{/each}
</tr>

<style lang="scss">
	.good, .ok, .bad {
		position: relative;
	}

	.good:before, .ok:before, .bad:before {
		content: '';
		display: block;
		position: absolute;
		width: 4px;
		height: 4px;
		left: 2px;
		bottom: 0;
		top: 0;
		margin: auto;
		border-radius: 50%;
		opacity: .5;
		/* Disable for now, add checkbox to filter later */
		display: none;
	}
	.good:before {
		background: limegreen;
	}
	.ok:before {
		background: yellow;
	}
	.bad:before {
		background: red;
	}

</style>