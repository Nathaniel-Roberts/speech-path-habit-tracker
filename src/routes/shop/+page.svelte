<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import type { Upgrade } from '$lib/game/types';
	import UpgradeCard from '$lib/components/shop/UpgradeCard.svelte';
	import CategoryTabs from '$lib/components/shop/CategoryTabs.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	// Local state for optimistic updates
	let coins = $state(data.coins);
	let purchasedUpgrades = $state<string[]>([...data.purchasedUpgrades]);
	let selectedCategory = $state<Upgrade['category']>('assessment');
	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	let pendingPurchase = $state<string | null>(null);

	// Sync with server data when it changes
	$effect(() => {
		coins = data.coins;
		purchasedUpgrades = [...data.purchasedUpgrades];
	});

	const categories: Upgrade['category'][] = ['assessment', 'tool', 'decor', 'staff', 'expansion'];

	let filteredUpgrades = $derived(
		data.upgrades.filter((u) => u.category === selectedCategory)
	);

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => {
			toast = null;
		}, 3000);
	}

	function handleCategorySelect(category: Upgrade['category']) {
		selectedCategory = category;
	}

	function isOwned(upgradeKey: string): boolean {
		return purchasedUpgrades.includes(upgradeKey);
	}

	function canAfford(cost: number): boolean {
		return coins >= cost;
	}

	function handlePurchase(upgradeKey: string) {
		// Find the form and submit it programmatically
		const form = document.getElementById(`purchase-form-${upgradeKey}`) as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}

	function createEnhanceHandler(upgrade: Upgrade) {
		return () => {
			// Optimistic update
			pendingPurchase = upgrade.key;
			coins -= upgrade.cost;
			purchasedUpgrades = [...purchasedUpgrades, upgrade.key];

			return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
				pendingPurchase = null;

				if (result.type === 'success') {
					showToast(`Purchased ${upgrade.name}!`, 'success');
					await update();
				} else if (result.type === 'failure') {
					// Revert optimistic update
					coins = data.coins;
					purchasedUpgrades = [...data.purchasedUpgrades];
					showToast(result.data?.error || 'Purchase failed', 'error');
				} else {
					await update();
				}
			};
		};
	}
</script>

<svelte:head>
	<title>Shop | Cottage Clinic</title>
</svelte:head>

<div class="shop-page">
	<header class="shop-header">
		<div class="header-content">
			<h1>Shop</h1>
			<p class="subtitle">Upgrade your cozy clinic</p>
		</div>
		<div class="coin-balance">
			<svg class="coin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="10" fill="var(--color-terracotta-300)" />
				<circle cx="12" cy="12" r="7" fill="var(--color-terracotta-400)" />
				<text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--color-cream-100)">C</text>
			</svg>
			<span class="balance-amount">{coins}</span>
			<span class="balance-label">coins</span>
		</div>
	</header>

	<CategoryTabs
		{categories}
		selected={selectedCategory}
		onSelect={handleCategorySelect}
	/>

	<main class="upgrades-grid">
		{#each filteredUpgrades as upgrade (upgrade.key)}
			<div class="upgrade-wrapper">
				<UpgradeCard
					{upgrade}
					owned={isOwned(upgrade.key)}
					canAfford={canAfford(upgrade.cost)}
					{coins}
					onPurchase={handlePurchase}
				/>
				<form
					id="purchase-form-{upgrade.key}"
					method="POST"
					action="?/purchase"
					use:enhance={createEnhanceHandler(upgrade)}
					class="hidden-form"
				>
					<input type="hidden" name="upgradeKey" value={upgrade.key} />
				</form>
			</div>
		{/each}

		{#if filteredUpgrades.length === 0}
			<div class="empty-state">
				<p>No upgrades available in this category.</p>
			</div>
		{/if}
	</main>

	{#if toast}
		<div class="toast toast-{toast.type}" role="alert">
			{#if toast.type === 'success'}
				<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			{:else}
				<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
			{/if}
			<span>{toast.message}</span>
		</div>
	{/if}
</div>

<style>
	.shop-page {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.shop-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-content h1 {
		font-family: var(--font-display);
		font-size: 2rem;
		color: var(--color-bark-500);
		margin: 0;
	}

	.subtitle {
		color: var(--color-bark-400);
		margin: 0.25rem 0 0 0;
		font-size: 0.9375rem;
	}

	.coin-balance {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--color-cream-50);
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
	}

	.coin-icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.balance-amount {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-terracotta-500);
	}

	.balance-label {
		color: var(--color-bark-400);
		font-size: 0.875rem;
	}

	.upgrades-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.upgrade-wrapper {
		position: relative;
	}

	.hidden-form {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 3rem 1rem;
		color: var(--color-bark-400);
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage);
	}

	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius-cottage);
		font-weight: 600;
		font-size: 0.9375rem;
		box-shadow: var(--shadow-cottage-lg);
		animation: toast-slide-up 0.3s ease;
		z-index: 100;
	}

	.toast-success {
		background-color: var(--color-sage-500);
		color: white;
	}

	.toast-error {
		background-color: var(--color-rose-400);
		color: white;
	}

	.toast-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	@keyframes toast-slide-up {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (max-width: 640px) {
		.shop-header {
			flex-direction: column;
			align-items: stretch;
		}

		.coin-balance {
			justify-content: center;
		}

		.header-content {
			text-align: center;
		}
	}
</style>
