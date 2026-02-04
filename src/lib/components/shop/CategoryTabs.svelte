<script lang="ts">
	import type { Upgrade } from '$lib/game/types';

	interface Props {
		categories: Upgrade['category'][];
		selected: Upgrade['category'];
		onSelect: (category: Upgrade['category']) => void;
	}

	let { categories, selected, onSelect }: Props = $props();

	const categoryLabels: Record<Upgrade['category'], string> = {
		assessment: 'Assessments',
		tool: 'Tools',
		decor: 'Decor',
		staff: 'Staff',
		expansion: 'Expansion'
	};

	const categoryIcons: Record<Upgrade['category'], string> = {
		assessment: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
		tool: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
		decor: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
		staff: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
		expansion: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
	};

	function handleKeyDown(event: KeyboardEvent, category: Upgrade['category']) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(category);
		}
	}
</script>

<nav class="category-tabs" role="tablist" aria-label="Shop categories">
	<div class="tabs-scroll-container">
		{#each categories as category}
			<button
				role="tab"
				class="tab"
				class:active={selected === category}
				aria-selected={selected === category}
				onclick={() => onSelect(category)}
				onkeydown={(e) => handleKeyDown(e, category)}
			>
				<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d={categoryIcons[category]} />
				</svg>
				<span class="tab-label">{categoryLabels[category]}</span>
			</button>
		{/each}
	</div>
</nav>

<style>
	.category-tabs {
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		padding: 0.375rem;
		box-shadow: var(--shadow-cottage);
	}

	.tabs-scroll-container {
		display: flex;
		gap: 0.25rem;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}

	.tabs-scroll-container::-webkit-scrollbar {
		display: none;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border-radius: calc(var(--radius-cottage) - 0.25rem);
		border: none;
		background-color: transparent;
		color: var(--color-bark-400);
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.tab:hover:not(.active) {
		background-color: var(--color-cream-200);
		color: var(--color-bark-500);
	}

	.tab:focus-visible {
		outline: 2px solid var(--color-sage-400);
		outline-offset: 2px;
	}

	.tab.active {
		background-color: var(--color-sage-500);
		color: white;
		box-shadow: 0 2px 4px rgba(90, 122, 74, 0.3);
	}

	.tab-icon {
		width: 1.125rem;
		height: 1.125rem;
		flex-shrink: 0;
	}

	.tab-label {
		display: block;
	}

	/* Mobile: show icons only on small screens */
	@media (max-width: 480px) {
		.tab {
			padding: 0.625rem 0.75rem;
		}

		.tab-label {
			display: none;
		}

		.tab-icon {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
