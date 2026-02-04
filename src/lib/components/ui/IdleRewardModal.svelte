<script lang="ts">
	import type { IdleRewardResult } from '$lib/game/types';
	import Button from './Button.svelte';

	interface Props {
		rewards: IdleRewardResult;
		onDismiss: () => void;
	}

	let { rewards, onDismiss }: Props = $props();

	function formatIdleTime(ms: number): string {
		const hours = Math.floor(ms / (1000 * 60 * 60));
		const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

		if (hours === 0) {
			return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
		} else if (minutes === 0) {
			return `${hours} hour${hours !== 1 ? 's' : ''}`;
		} else {
			return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onDismiss();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onDismiss();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="modal-backdrop"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="idle-reward-title"
	tabindex="0"
>
	<div class="modal-content">
		<div class="modal-header">
			<span class="sparkle-left" aria-hidden="true">*</span>
			<h2 id="idle-reward-title" class="modal-title">While you were away...</h2>
			<span class="sparkle-right" aria-hidden="true">*</span>
		</div>

		<div class="reward-illustration" aria-hidden="true">
			<svg viewBox="0 0 100 100" class="clinic-icon">
				<rect x="20" y="40" width="60" height="50" fill="var(--color-cream-300)" rx="4" />
				<polygon points="10,40 50,15 90,40" fill="var(--color-terracotta-300)" />
				<rect x="40" y="60" width="20" height="30" fill="var(--color-bark-300)" />
				<rect x="30" y="50" width="12" height="12" fill="var(--color-sage-200)" />
				<rect x="58" y="50" width="12" height="12" fill="var(--color-sage-200)" />
				<circle cx="50" cy="30" r="5" fill="var(--color-rose-300)" />
			</svg>
		</div>

		<p class="time-away">
			Your clinic was busy for <strong>{formatIdleTime(rewards.timeElapsedMs)}</strong>
			{#if rewards.capped}
				<span class="cap-note">(max 12 hours)</span>
			{/if}
		</p>

		<div class="rewards-summary">
			<div class="reward-item">
				<span class="reward-icon coin-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" fill="var(--color-terracotta-400)" />
						<circle cx="12" cy="12" r="7" fill="var(--color-terracotta-300)" />
						<text
							x="12"
							y="16"
							text-anchor="middle"
							font-size="10"
							font-weight="bold"
							fill="var(--color-terracotta-500)">$</text
						>
					</svg>
				</span>
				<span class="reward-value">+{rewards.coins}</span>
				<span class="reward-label">coins earned</span>
			</div>

			<div class="reward-item">
				<span class="reward-icon client-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="8" r="4" fill="var(--color-sage-400)" />
						<path
							d="M4 20c0-4 4-6 8-6s8 2 8 6"
							stroke="var(--color-sage-400)"
							stroke-width="2"
							fill="none"
						/>
					</svg>
				</span>
				<span class="reward-value">{rewards.clients}</span>
				<span class="reward-label">clients seen</span>
			</div>
		</div>

		<div class="modal-actions">
			<Button variant="primary" onclick={onDismiss}>Claim Rewards</Button>
		</div>

		<p class="cozy-message">Your clients are happy and your clinic is thriving!</p>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(89, 77, 64, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 100;
		animation: fade-in 0.3s ease;
	}

	.modal-content {
		position: relative;
		background: linear-gradient(
			180deg,
			var(--color-cream-50) 0%,
			var(--color-cream-100) 100%
		);
		border-radius: var(--radius-cottage-lg);
		box-shadow: var(--shadow-cottage-lg), 0 0 0 4px var(--color-terracotta-200);
		padding: 2rem;
		max-width: 24rem;
		width: 100%;
		text-align: center;
		animation: bounce-in 0.4s ease;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.modal-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--color-bark-500);
		margin: 0;
	}

	.sparkle-left,
	.sparkle-right {
		font-size: 1.5rem;
		color: var(--color-terracotta-400);
		animation: sparkle 1s ease infinite;
	}

	.sparkle-right {
		animation-delay: 0.5s;
	}

	.reward-illustration {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.clinic-icon {
		width: 80px;
		height: 80px;
	}

	.time-away {
		font-size: 1rem;
		color: var(--color-bark-400);
		margin: 0 0 1.5rem 0;
	}

	.time-away strong {
		color: var(--color-bark-500);
	}

	.cap-note {
		display: block;
		font-size: 0.75rem;
		color: var(--color-bark-300);
		font-style: italic;
		margin-top: 0.25rem;
	}

	.rewards-summary {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.reward-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.reward-icon {
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.25rem;
	}

	.reward-icon svg {
		width: 100%;
		height: 100%;
	}

	.reward-value {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-bark-500);
	}

	.reward-label {
		font-size: 0.75rem;
		color: var(--color-bark-400);
	}

	.modal-actions {
		margin-bottom: 1rem;
	}

	.cozy-message {
		font-size: 0.875rem;
		color: var(--color-sage-500);
		font-style: italic;
		margin: 0;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes bounce-in {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(1rem);
		}
		50% {
			transform: scale(1.02) translateY(0);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.8);
		}
	}
</style>
