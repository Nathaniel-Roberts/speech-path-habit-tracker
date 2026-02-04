<script>
	/**
	 * @type {{
	 *   variant?: 'primary' | 'secondary' | 'danger',
	 *   disabled?: boolean,
	 *   type?: 'button' | 'submit' | 'reset',
	 *   onclick?: (event: MouseEvent) => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		variant = 'primary',
		disabled = false,
		type = 'button',
		onclick,
		children
	} = $props();
</script>

<button
	class="btn btn-{variant}"
	class:btn-disabled={disabled}
	{type}
	{disabled}
	{onclick}
>
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border-radius: var(--radius-cottage);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9375rem;
		transition: all 0.2s ease;
		cursor: pointer;
		border: none;
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-sage-400);
		outline-offset: 2px;
	}

	.btn-primary {
		background-color: var(--color-sage-500);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: var(--color-sage-600);
		transform: translateY(-1px);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-secondary {
		background-color: var(--color-cream-200);
		color: var(--color-bark-500);
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: var(--color-cream-300);
		transform: translateY(-1px);
	}

	.btn-secondary:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-danger {
		background-color: var(--color-rose-400);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background-color: var(--color-rose-300);
		transform: translateY(-1px);
	}

	.btn-danger:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn:disabled,
	.btn-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
