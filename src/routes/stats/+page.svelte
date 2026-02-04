<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Clinic Stats | Speech Path Clinic</title>
</svelte:head>

<div class="stats-page">
	<header class="stats-header">
		<h1>Clinic Stats</h1>
		<p class="subtitle">See how your upgrades are improving your clinic</p>
	</header>

	<div class="stats-overview">
		<div class="stat-card highlight">
			<div class="stat-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-label">Client Capacity</span>
				<span class="stat-value">{data.stats.clientCapacity.base + data.stats.clientCapacity.bonus}</span>
				{#if data.stats.clientCapacity.bonus > 0}
					<span class="stat-bonus">+{data.stats.clientCapacity.bonus} from upgrades</span>
				{/if}
			</div>
		</div>

		<div class="stat-card highlight">
			<div class="stat-icon satisfaction">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-label">Client Satisfaction</span>
				<span class="stat-value">+{data.stats.satisfactionPercent.bonus}%</span>
				{#if data.stats.satisfactionPercent.sources.length > 0}
					<span class="stat-bonus">{data.stats.satisfactionPercent.sources.length} items contributing</span>
				{/if}
			</div>
		</div>

		<div class="stat-card highlight">
			<div class="stat-icon income">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-label">Income Multiplier</span>
				<span class="stat-value">{((data.stats.incomeMultiplier.base + data.stats.incomeMultiplier.bonus) * 100).toFixed(0)}%</span>
				{#if data.stats.incomeMultiplier.bonus > 0}
					<span class="stat-bonus">+{(data.stats.incomeMultiplier.bonus * 100).toFixed(0)}% from staff</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="stats-summary">
		<div class="summary-item">
			<span class="summary-value">{data.totalUpgrades}</span>
			<span class="summary-label">Upgrades Owned</span>
		</div>
		<div class="summary-item">
			<span class="summary-value">{data.totalSpent}</span>
			<span class="summary-label">Total Coins Spent</span>
		</div>
	</div>

	{#if data.stats.clientCapacity.sources.length > 0}
		<section class="breakdown-section">
			<h2>Client Capacity Breakdown</h2>
			<div class="breakdown-list">
				<div class="breakdown-item base">
					<span class="item-name">Base Capacity</span>
					<span class="item-value">+{data.stats.clientCapacity.base}</span>
				</div>
				{#each data.stats.clientCapacity.sources as source}
					<div class="breakdown-item">
						<span class="item-name">{source.name}</span>
						<span class="item-value">+{source.value}</span>
					</div>
				{/each}
				<div class="breakdown-item total">
					<span class="item-name">Total</span>
					<span class="item-value">{data.stats.clientCapacity.base + data.stats.clientCapacity.bonus}</span>
				</div>
			</div>
		</section>
	{/if}

	{#if data.stats.satisfactionPercent.sources.length > 0}
		<section class="breakdown-section">
			<h2>Satisfaction Breakdown</h2>
			<div class="breakdown-list">
				{#each data.stats.satisfactionPercent.sources as source}
					<div class="breakdown-item">
						<span class="item-name">{source.name}</span>
						<span class="item-value">+{source.value}%</span>
					</div>
				{/each}
				<div class="breakdown-item total">
					<span class="item-name">Total Bonus</span>
					<span class="item-value">+{data.stats.satisfactionPercent.bonus}%</span>
				</div>
			</div>
		</section>
	{/if}

	{#if data.stats.incomeMultiplier.sources.length > 0}
		<section class="breakdown-section">
			<h2>Income Multiplier Breakdown</h2>
			<div class="breakdown-list">
				<div class="breakdown-item base">
					<span class="item-name">Base Rate</span>
					<span class="item-value">100%</span>
				</div>
				{#each data.stats.incomeMultiplier.sources as source}
					<div class="breakdown-item">
						<span class="item-name">{source.name}</span>
						<span class="item-value">+{(source.value * 100).toFixed(0)}%</span>
					</div>
				{/each}
				<div class="breakdown-item total">
					<span class="item-name">Total</span>
					<span class="item-value">{((data.stats.incomeMultiplier.base + data.stats.incomeMultiplier.bonus) * 100).toFixed(0)}%</span>
				</div>
			</div>
		</section>
	{/if}

	{#if data.totalUpgrades === 0}
		<div class="empty-state">
			<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
			</svg>
			<h2>No upgrades yet!</h2>
			<p>Visit the <a href="/shop">Shop</a> to purchase upgrades and start improving your clinic.</p>
		</div>
	{/if}
</div>

<style>
	.stats-page {
		padding: 1rem;
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.stats-header {
		text-align: center;
	}

	.stats-header h1 {
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

	.stats-overview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
	}

	.stat-card.highlight {
		border-left: 4px solid var(--color-sage-500);
	}

	.stat-icon {
		width: 3rem;
		height: 3rem;
		padding: 0.5rem;
		background: var(--color-sage-100);
		border-radius: 50%;
		color: var(--color-sage-600);
		flex-shrink: 0;
	}

	.stat-icon.satisfaction {
		background: var(--color-rose-100);
		color: var(--color-rose-500);
	}

	.stat-icon.income {
		background: var(--color-honey-100);
		color: var(--color-honey-600);
	}

	.stat-icon svg {
		width: 100%;
		height: 100%;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-bark-400);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-bark-500);
	}

	.stat-bonus {
		font-size: 0.8125rem;
		color: var(--color-sage-600);
	}

	.stats-summary {
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding: 1rem;
		background: var(--color-cream-100);
		border-radius: var(--radius-cottage);
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.summary-value {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-sage-600);
	}

	.summary-label {
		font-size: 0.8125rem;
		color: var(--color-bark-400);
	}

	.breakdown-section {
		background: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
		overflow: hidden;
	}

	.breakdown-section h2 {
		font-family: var(--font-display);
		font-size: 1rem;
		color: var(--color-bark-500);
		margin: 0;
		padding: 1rem;
		background: var(--color-cream-100);
		border-bottom: 1px solid var(--color-cream-200);
	}

	.breakdown-list {
		padding: 0.5rem 0;
	}

	.breakdown-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.625rem 1rem;
	}

	.breakdown-item.base {
		color: var(--color-bark-400);
		font-style: italic;
	}

	.breakdown-item.total {
		border-top: 1px solid var(--color-cream-200);
		margin-top: 0.5rem;
		padding-top: 0.75rem;
		font-weight: 600;
	}

	.item-name {
		color: var(--color-bark-500);
	}

	.item-value {
		font-family: var(--font-display);
		color: var(--color-sage-600);
		font-weight: 600;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		background: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		color: var(--color-bark-300);
		margin-bottom: 1rem;
	}

	.empty-state h2 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--color-bark-500);
		margin: 0 0 0.5rem 0;
	}

	.empty-state p {
		color: var(--color-bark-400);
		margin: 0;
	}

	.empty-state a {
		color: var(--color-sage-600);
		font-weight: 600;
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.stats-header h1 {
			font-size: 1.5rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}
	}
</style>
