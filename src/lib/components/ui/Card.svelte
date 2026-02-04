<script>
	/**
	 * @type {{
	 *   class?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { class: className = '', children } = $props();
</script>

<div class="card {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.card {
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
		padding: 1rem;
		transition: box-shadow 0.2s ease;
	}

	.card:hover {
		box-shadow: var(--shadow-cottage-lg);
	}
</style>
