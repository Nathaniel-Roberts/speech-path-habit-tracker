<script lang="ts">
	import type { Upgrade } from '$lib/game/types';

	interface Props {
		upgrade: Upgrade;
		owned: boolean;
		canAfford: boolean;
		coins: number;
		onPurchase: (upgradeKey: string) => void;
	}

	let { upgrade, owned, canAfford, coins, onPurchase }: Props = $props();

	// "Almost there" if you have at least 50% of the cost
	const almostThere = $derived(!owned && !canAfford && coins >= upgrade.cost * 0.5);
	const coinsNeeded = $derived(upgrade.cost - coins);

	const categoryLabels: Record<Upgrade['category'], string> = {
		assessment: 'Assessment',
		tool: 'Tool',
		decor: 'Decor',
		staff: 'Staff',
		expansion: 'Expansion'
	};

	const categoryColors: Record<Upgrade['category'], string> = {
		assessment: 'bg-[var(--color-sage-200)] text-[var(--color-sage-600)]',
		tool: 'bg-[var(--color-terracotta-200)] text-[var(--color-terracotta-500)]',
		decor: 'bg-[var(--color-rose-200)] text-[var(--color-rose-400)]',
		staff: 'bg-[var(--color-bark-200)] text-[var(--color-bark-500)]',
		expansion: 'bg-[var(--color-cream-300)] text-[var(--color-bark-400)]'
	};

	function formatEffects(effects: Upgrade['effects']): string {
		const parts: string[] = [];
		if (effects.clientCapacity) {
			parts.push(`+${effects.clientCapacity} client capacity`);
		}
		if (effects.satisfactionPercent) {
			parts.push(`+${effects.satisfactionPercent}% satisfaction`);
		}
		if (effects.incomeMultiplier) {
			parts.push(`+${Math.round(effects.incomeMultiplier * 100)}% income`);
		}
		return parts.join(', ');
	}

	function handlePurchase() {
		if (!owned && canAfford) {
			onPurchase(upgrade.key);
		}
	}
</script>

<article class="upgrade-card" class:owned class:cannot-afford={!canAfford && !owned}>
	<div class="card-header">
		<span class="category-badge {categoryColors[upgrade.category]}">
			{categoryLabels[upgrade.category]}
		</span>
		{#if owned}
			<span class="owned-badge">Owned</span>
		{:else if almostThere}
			<span class="almost-badge">Almost there!</span>
		{/if}
	</div>

	<div class="card-body">
		<h3 class="upgrade-name">{upgrade.name}</h3>
		<p class="upgrade-description">{upgrade.description}</p>
		<p class="upgrade-effects">{formatEffects(upgrade.effects)}</p>
	</div>

	<div class="card-footer">
		<div class="cost" class:greyed-out={!canAfford && !owned}>
			<svg class="coin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="10" fill="var(--color-terracotta-300)" />
				<circle cx="12" cy="12" r="7" fill="var(--color-terracotta-400)" />
				<text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--color-cream-100)">C</text>
			</svg>
			<span class="cost-amount">{upgrade.cost}</span>
		</div>

		<button
			class="purchase-btn"
			class:almost={almostThere}
			disabled={owned || !canAfford}
			onclick={handlePurchase}
		>
			{#if owned}
				Owned
			{:else if almostThere}
				Need {coinsNeeded} more
			{:else if !canAfford}
				Not enough coins
			{:else}
				Purchase
			{/if}
		</button>
	</div>
</article>

<style>
	.upgrade-card {
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: all 0.2s ease;
		border: 2px solid transparent;
	}

	.upgrade-card:hover:not(.owned) {
		box-shadow: var(--shadow-cottage-lg);
		transform: translateY(-2px);
	}

	.upgrade-card.owned {
		background-color: var(--color-sage-100);
		border-color: var(--color-sage-300);
	}

	.upgrade-card.cannot-afford {
		opacity: 0.7;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.category-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.owned-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		background-color: var(--color-sage-400);
		color: white;
	}

	.almost-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		background-color: var(--color-terracotta-300);
		color: var(--color-terracotta-500);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.card-body {
		flex: 1;
	}

	.upgrade-name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-bark-500);
		margin: 0 0 0.375rem 0;
	}

	.upgrade-description {
		font-size: 0.875rem;
		color: var(--color-bark-400);
		margin: 0 0 0.5rem 0;
		line-height: 1.4;
	}

	.upgrade-effects {
		font-size: 0.75rem;
		color: var(--color-sage-500);
		font-weight: 600;
		margin: 0;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-cream-200);
	}

	.cost {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-terracotta-500);
	}

	.cost.greyed-out {
		color: var(--color-bark-300);
		opacity: 0.6;
	}

	.coin-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.cost-amount {
		font-family: var(--font-display);
	}

	.purchase-btn {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-cottage);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--color-sage-500);
		color: white;
	}

	.purchase-btn:hover:not(:disabled) {
		background-color: var(--color-sage-600);
		transform: translateY(-1px);
	}

	.purchase-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.purchase-btn:disabled {
		background-color: var(--color-cream-300);
		color: var(--color-bark-300);
		cursor: not-allowed;
	}

	.purchase-btn.almost:disabled {
		background-color: var(--color-terracotta-200);
		color: var(--color-terracotta-500);
	}
</style>
