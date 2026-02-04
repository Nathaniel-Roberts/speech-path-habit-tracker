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
		<h1 class="app-title">Speech Path Clinic</h1>
		<div class="top-bar-right">
			<CoinDisplay amount={data.save.gameState.coins} />
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

	.app-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-sage-600);
		margin: 0;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.main-content {
		flex: 1;
		padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
	}
</style>
