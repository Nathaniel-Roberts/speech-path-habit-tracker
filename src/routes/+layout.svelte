<script lang="ts">
	import type { LayoutData } from './$types';
	import CoinDisplay from '$lib/components/ui/CoinDisplay.svelte';
	import BottomNav from '$lib/components/ui/BottomNav.svelte';
	import IdleRewardModal from '$lib/components/ui/IdleRewardModal.svelte';
	import '../app.css';

	interface Props {
		data: LayoutData;
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let showIdleRewards = $state(data.idleRewards.coins > 0);

	function dismissIdleRewards() {
		showIdleRewards = false;
	}
</script>

<div class="app-layout">
	<header class="top-bar">
		<a href="/" class="app-title-link">
			<h1 class="app-title">Speech Path Clinic</h1>
		</a>
		<div class="top-bar-right">
			<CoinDisplay amount={data.save.gameState.coins} />
			<a href="/settings" class="settings-link" aria-label="Settings">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="3"></circle>
					<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
				</svg>
			</a>
		</div>
	</header>

	<main class="main-content">
		{@render children()}
	</main>

	<BottomNav />
</div>

{#if showIdleRewards}
	<IdleRewardModal rewards={data.idleRewards} onDismiss={dismissIdleRewards} />
{/if}

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	.top-bar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--color-cream-50);
		border-bottom: 1px solid var(--color-cream-300);
		padding: 0.75rem 1rem;
		padding-top: calc(0.75rem + env(safe-area-inset-top, 0px));
		box-shadow: 0 2px 8px rgba(139, 90, 60, 0.06);
	}

	.app-title-link {
		text-decoration: none;
	}

	.app-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-sage-600);
		margin: 0;
		transition: color 0.2s ease;
	}

	.app-title-link:hover .app-title {
		color: var(--color-sage-500);
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.settings-link {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.375rem;
		color: var(--color-bark-400);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.settings-link:hover {
		color: var(--color-sage-500);
		background-color: var(--color-sage-100);
	}

	.main-content {
		flex: 1;
		padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
	}
</style>
