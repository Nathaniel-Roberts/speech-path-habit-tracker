<script>
	/**
	 * @type {{
	 *   amount: number,
	 *   size?: 'sm' | 'lg'
	 * }}
	 */
	let { amount, size = 'sm' } = $props();

	let isPopping = $state(false);
	let previousAmount = $state(amount);

	$effect(() => {
		if (amount !== previousAmount) {
			isPopping = true;
			previousAmount = amount;

			// Remove the animation class after it completes
			const timeout = setTimeout(() => {
				isPopping = false;
			}, 300);

			return () => clearTimeout(timeout);
		}
	});
</script>

<div class="coin-display coin-display-{size}" class:coin-pop={isPopping}>
	<span class="coin-icon" aria-hidden="true">
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="12" r="10" fill="var(--color-terracotta-400)"/>
			<circle cx="12" cy="12" r="7" fill="var(--color-terracotta-300)"/>
			<text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--color-terracotta-500)">$</text>
		</svg>
	</span>
	<span class="coin-amount">{amount}</span>
</div>

<style>
	.coin-display {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-family: var(--font-body);
		font-weight: 700;
		color: var(--color-bark-500);
	}

	.coin-display-sm {
		font-size: 1rem;
	}

	.coin-display-sm .coin-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.coin-display-lg {
		font-size: 1.5rem;
	}

	.coin-display-lg .coin-icon {
		width: 2rem;
		height: 2rem;
	}

	.coin-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.coin-icon svg {
		width: 100%;
		height: 100%;
	}

	.coin-amount {
		min-width: 1.5ch;
	}

	.coin-pop {
		animation: coin-pop 0.3s ease;
	}

	@keyframes coin-pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
