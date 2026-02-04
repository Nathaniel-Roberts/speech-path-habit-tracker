<script>
	/**
	 * @type {{
	 *   message: string,
	 *   type?: 'success' | 'error' | 'info',
	 *   visible: boolean,
	 *   onDismiss?: () => void
	 * }}
	 */
	let { message, type = 'info', visible, onDismiss } = $props();

	$effect(() => {
		if (visible && onDismiss) {
			const timeout = setTimeout(() => {
				onDismiss();
			}, 3000);

			return () => clearTimeout(timeout);
		}
	});
</script>

{#if visible}
	<div class="toast toast-{type}" role="alert" aria-live="polite">
		<span class="toast-icon" aria-hidden="true">
			{#if type === 'success'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			{:else if type === 'error'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="2"/>
					<path d="M10 6.667V10M10 13.333H10.008" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="2"/>
					<path d="M10 9.167V13.333M10 6.667H10.008" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			{/if}
		</span>
		<span class="toast-message">{message}</span>
		{#if onDismiss}
			<button class="toast-close" onclick={onDismiss} aria-label="Dismiss">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage-lg);
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-weight: 500;
		z-index: 200;
		animation: toast-in 0.3s ease;
	}

	.toast-success {
		background-color: var(--color-sage-100);
		color: var(--color-sage-600);
		border: 1px solid var(--color-sage-300);
	}

	.toast-error {
		background-color: var(--color-rose-100);
		color: var(--color-rose-400);
		border: 1px solid var(--color-rose-300);
	}

	.toast-info {
		background-color: var(--color-cream-100);
		color: var(--color-bark-500);
		border: 1px solid var(--color-bark-200);
	}

	.toast-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.toast-message {
		flex: 1;
	}

	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: inherit;
		opacity: 0.7;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.25rem;
		transition: opacity 0.2s ease;
		flex-shrink: 0;
	}

	.toast-close:hover {
		opacity: 1;
	}

	.toast-close:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
