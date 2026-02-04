<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let renderer: import('$lib/pixi/clinic-renderer').ClinicRenderer | null = $state(null);
	let containerWidth = $state(0);
	let containerRef: HTMLDivElement | undefined = $state();

	// Compute canvas dimensions maintaining 16:10 aspect ratio
	let canvasDimensions = $derived.by(() => {
		const aspectRatio = 16 / 10;
		const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400;
		const width = containerWidth || 800;
		let height = width / aspectRatio;

		if (height > maxHeight) {
			height = maxHeight;
		}

		return { width: Math.floor(width), height: Math.floor(height) };
	});

	// Check if user has any purchased upgrades with position data
	let hasVisibleUpgrades = $derived(
		data.purchasedUpgrades.some((key) => {
			const upgrade = data.upgrades.find((u) => u.key === key);
			return upgrade && upgrade.position !== null;
		})
	);

	let cleanupResize: (() => void) | null = null;

	onMount(() => {
		// Measure container width
		if (containerRef) {
			containerWidth = containerRef.clientWidth;
		}

		// Handle window resize
		const handleResize = () => {
			if (containerRef) {
				containerWidth = containerRef.clientWidth;
			}
		};

		window.addEventListener('resize', handleResize);
		cleanupResize = () => window.removeEventListener('resize', handleResize);

		// Initialize PixiJS asynchronously
		initRenderer();

		return () => {
			cleanupResize?.();
		};
	});

	async function initRenderer() {
		// Dynamically import ClinicRenderer to avoid SSR issues
		const { ClinicRenderer } = await import('$lib/pixi/clinic-renderer');
		renderer = new ClinicRenderer();

		// Wait for canvas to be bound and dimensions to be calculated
		await new Promise((resolve) => setTimeout(resolve, 0));

		if (canvas && canvasDimensions.width > 0 && canvasDimensions.height > 0) {
			await renderer.init(canvas, canvasDimensions.width, canvasDimensions.height);
			renderer.renderUpgrades(data.purchasedUpgrades, data.upgrades);
		}
	}

	onDestroy(() => {
		if (renderer) {
			renderer.destroy();
			renderer = null;
		}
	});

	// Re-render when dimensions change
	$effect(() => {
		if (renderer && canvasDimensions.width > 0 && canvasDimensions.height > 0) {
			renderer.resize(canvasDimensions.width, canvasDimensions.height);
			renderer.renderUpgrades(data.purchasedUpgrades, data.upgrades);
		}
	});
</script>

<svelte:head>
	<title>Your Clinic | Cottage Clinic</title>
</svelte:head>

<div class="clinic-page">
	<header class="clinic-header">
		<h1>Your Cozy Clinic</h1>
		<p class="subtitle">Watch your space grow as you progress</p>
	</header>

	<div class="clinic-view-container" bind:this={containerRef}>
		<div class="clinic-frame">
			<canvas
				bind:this={canvas}
				width={canvasDimensions.width}
				height={canvasDimensions.height}
				class="clinic-canvas"
			></canvas>

			{#if !hasVisibleUpgrades && data.purchasedUpgrades.length === 0}
				<div class="empty-overlay">
					<div class="empty-content">
						<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
						<h2>Your clinic is just getting started!</h2>
						<p>Visit the <a href="/shop">Shop</a> to purchase your first upgrades and make this space your own.</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="upgrade-count">
		<span class="count">{data.purchasedUpgrades.length}</span>
		<span class="label">upgrade{data.purchasedUpgrades.length !== 1 ? 's' : ''} purchased</span>
	</div>
</div>

<style>
	.clinic-page {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.clinic-header {
		text-align: center;
	}

	.clinic-header h1 {
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

	.clinic-view-container {
		width: 100%;
	}

	.clinic-frame {
		position: relative;
		background: linear-gradient(135deg, var(--color-cream-200) 0%, var(--color-cream-100) 100%);
		border: 4px solid var(--color-bark-300);
		border-radius: var(--radius-cottage);
		box-shadow:
			var(--shadow-cottage-lg),
			inset 0 0 20px rgba(139, 115, 85, 0.1);
		overflow: hidden;
	}

	/* Decorative corner flourishes */
	.clinic-frame::before,
	.clinic-frame::after {
		content: '';
		position: absolute;
		width: 24px;
		height: 24px;
		border: 3px solid var(--color-bark-400);
		opacity: 0.4;
		pointer-events: none;
		z-index: 10;
	}

	.clinic-frame::before {
		top: 8px;
		left: 8px;
		border-right: none;
		border-bottom: none;
		border-top-left-radius: 8px;
	}

	.clinic-frame::after {
		bottom: 8px;
		right: 8px;
		border-left: none;
		border-top: none;
		border-bottom-right-radius: 8px;
	}

	.clinic-canvas {
		display: block;
		width: 100%;
		height: auto;
		max-height: 60vh;
	}

	.empty-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(250, 245, 235, 0.9);
	}

	.empty-content {
		text-align: center;
		padding: 2rem;
		max-width: 400px;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		color: var(--color-bark-300);
		margin-bottom: 1rem;
	}

	.empty-content h2 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--color-bark-500);
		margin: 0 0 0.75rem 0;
	}

	.empty-content p {
		color: var(--color-bark-400);
		margin: 0;
		line-height: 1.6;
	}

	.empty-content a {
		color: var(--color-sage-600);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 2px;
	}

	.empty-content a:hover {
		color: var(--color-sage-700);
	}

	.upgrade-count {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: var(--color-cream-50);
		border-radius: var(--radius-cottage);
		box-shadow: var(--shadow-cottage);
	}

	.upgrade-count .count {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-sage-600);
	}

	.upgrade-count .label {
		color: var(--color-bark-400);
		font-size: 0.9375rem;
	}

	@media (max-width: 640px) {
		.clinic-header h1 {
			font-size: 1.5rem;
		}

		.empty-content {
			padding: 1.5rem;
		}

		.empty-icon {
			width: 3rem;
			height: 3rem;
		}

		.empty-content h2 {
			font-size: 1.125rem;
		}
	}
</style>
