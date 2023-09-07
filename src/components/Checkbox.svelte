<script>
	export let checkboxLabel = '';
	export let checked = false;
</script>

<label class="c-checkbox" hasChecked={checked}>
	<input type="checkbox" bind:checked={checked} />
	{checkboxLabel}
</label>

<style>

	.c-checkbox {


	}

	.c-checkbox {
		font-size: 1rem;
		display: grid;
		grid-template-columns: 1em auto;
		grid-gap: 1rem;
		margin-bottom: 1rem;
		line-height: 1.25;
		padding: .25rem;
	}

	.c-checkbox:last-child {
		margin-bottom: 0;
	}

	.c-checkbox:hover,
	.c-checkbox input:hover {
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: var(--color-medpink)
	}

	.c-checkbox [type="checkbox"] {
		-webkit-appearance: none;
		appearance: none;
		background-color: var(--color-dark);
		font-size: inherit;
		margin: 0;
		padding: 0;
		width: 1.25em;
		height: 1.25em;
		display: grid;
		place-content: center;
		border: 1px solid var(--color-accents);
	}

	.c-checkbox [type="checkbox"]::before {
		content: '';
		width: 1.25em;
		height: 1.25em;
		background: var(--color-accents);
		transform: scale(0);
		transition: transform 200ms ease-out;
	}

	.c-checkbox [type="checkbox"]:checked::before {
		transform: scale(.75);
	}

	.c-checkbox:hover [type="checkbox"]::before,
	.c-checkbox [type="checkbox"]:hover::before {
		filter: brightness(1.25);
		transform: scale(.25);
	}

	.c-checkbox[hasChecked="true"]:hover input:checked::before,
	.c-checkbox input:checked:hover::before {
		transform: scale(.65);
	}

	.c-checkbox input:focus {
		outline: 1px solid var(--color-lightgray);
	}
</style>