<script>
	/**
	 * @type {{
	 *   open: boolean,
	 *   onClose: () => void,
	 *   title?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { open, onClose, title = '', children } = $props();

	/**
	 * Handle backdrop click to close
	 * @param {MouseEvent} event
	 */
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	/**
	 * Handle escape key to close
	 * @param {KeyboardEvent} event
	 */
	function handleKeydown(event) {
		if (event.key === 'Escape' && open) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="modal-backdrop"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<div class="modal-content">
			{#if title}
				<h2 id="modal-title" class="modal-title">{title}</h2>
			{/if}
			<button class="modal-close" onclick={onClose} aria-label="Close modal">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="modal-body">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(89, 77, 64, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 100;
		animation: fade-in 0.2s ease;
	}

	.modal-content {
		position: relative;
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage-lg);
		box-shadow: var(--shadow-cottage-lg);
		padding: 1.5rem;
		max-width: 32rem;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		animation: slide-up 0.3s ease;
	}

	.modal-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--color-bark-500);
		margin: 0 0 1rem 0;
		padding-right: 2rem;
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: transparent;
		border: none;
		color: var(--color-bark-300);
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.25rem;
		transition: color 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-close:hover {
		color: var(--color-bark-500);
	}

	.modal-close:focus-visible {
		outline: 2px solid var(--color-sage-400);
		outline-offset: 2px;
	}

	.modal-body {
		color: var(--color-bark-400);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
