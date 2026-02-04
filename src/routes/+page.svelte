<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	let completingId = $state<string | null>(null);

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => {
			toast = null;
		}, 3000);
	}

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) {
			return 'Good morning';
		} else if (hour < 17) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}

	function isToday(dateString: string | null): boolean {
		if (!dateString) return false;
		const date = new Date(dateString);
		const today = new Date();
		return (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		);
	}

	let greeting = $derived(getGreeting());
	let habitsCompletedToday = $derived(
		data.save.habits.filter((h) => isToday(h.lastCompleted)).length
	);
	let todaysHabits = $derived(
		data.save.habits
			.filter((h) => h.recurrence === 'daily' || h.recurrence === 'weekly')
			.slice(0, 5)
	);
	let incompleteHabits = $derived(
		todaysHabits.filter((h) => !isToday(h.lastCompleted))
	);
</script>

<div class="dashboard">
	<section class="welcome-section">
		<h2 class="greeting">{greeting}!</h2>
		<p class="welcome-message">
			Welcome back to your cozy speech therapy clinic. Your little corner of the world is ready for
			another day of helping others find their voice.
		</p>
	</section>

	<section class="stats-section">
		<h3 class="section-title">Your Progress</h3>
		<div class="stats-grid">
			<Card>
				<div class="stat-card">
					<span class="stat-icon" aria-hidden="true">
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
					<span class="stat-value">{data.save.gameState.coins}</span>
					<span class="stat-label">Current Coins</span>
				</div>
			</Card>

			<Card>
				<div class="stat-card">
					<span class="stat-icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none">
							<path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="var(--color-sage-400)" />
						</svg>
					</span>
					<span class="stat-value">{data.save.gameState.lifetimeCoins}</span>
					<span class="stat-label">Lifetime Coins</span>
				</div>
			</Card>

			<Card>
				<div class="stat-card">
					<span class="stat-icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-400)" stroke-width="2">
							<path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
							<circle cx="12" cy="12" r="10" />
						</svg>
					</span>
					<span class="stat-value">{habitsCompletedToday}</span>
					<span class="stat-label">Completed Today</span>
				</div>
			</Card>
		</div>
	</section>

	{#if incompleteHabits.length > 0}
		<section class="habits-section">
			<div class="section-header">
				<h3 class="section-title">Today's Habits</h3>
				<a href="/habits" class="view-all-link">View all</a>
			</div>

			<div class="habits-preview">
				{#each incompleteHabits as habit (habit.id)}
					<Card>
						<div class="habit-preview-card">
							<div class="habit-info">
								<span class="habit-name">{habit.name}</span>
								<span class="habit-reward">
									<span class="coin-mini" aria-hidden="true">
										<svg viewBox="0 0 24 24" fill="none">
											<circle cx="12" cy="12" r="10" fill="var(--color-terracotta-400)" />
											<circle cx="12" cy="12" r="7" fill="var(--color-terracotta-300)" />
										</svg>
									</span>
									+{habit.coinReward}
								</span>
							</div>
							<div class="habit-actions">
								{#if habit.streak > 0}
									<span class="streak-mini">
										{habit.streak}
									</span>
								{/if}
								<form
									method="POST"
									action="?/complete"
									use:enhance={() => {
										completingId = habit.id;
										return async ({ result, update }) => {
											completingId = null;
											if (result.type === 'success' && result.data) {
												showToast(`+${result.data.coinsAwarded} coins!`, 'success');
											}
											await update();
										};
									}}
								>
									<input type="hidden" name="habitId" value={habit.id} />
									<button
										type="submit"
										class="quick-complete-btn"
										disabled={completingId === habit.id}
									>
										{completingId === habit.id ? '...' : '✓'}
									</button>
								</form>
							</div>
						</div>
					</Card>
				{/each}
			</div>

			<div class="habits-cta">
				<a href="/habits" class="manage-link">Manage habits →</a>
			</div>
		</section>
	{:else if data.save.habits.length > 0}
		<section class="all-done-section">
			<Card>
				<div class="all-done-card">
					<span class="all-done-icon" aria-hidden="true">
						<svg viewBox="0 0 48 48" fill="none">
							<circle cx="24" cy="24" r="20" fill="var(--color-sage-100)" />
							<path d="M16 24l6 6 12-12" stroke="var(--color-sage-500)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</span>
					<h3 class="all-done-title">All done for today!</h3>
					<p class="all-done-message">
						You've completed all your habits. Take a moment to appreciate your hard work.
					</p>
				</div>
			</Card>
		</section>
	{:else}
		<section class="empty-habits-section">
			<Card>
				<div class="empty-habits-card">
					<p class="empty-message">
						You haven't created any habits yet. Start building healthy routines!
					</p>
					<a href="/habits">
						<Button variant="primary">Create Your First Habit</Button>
					</a>
				</div>
			</Card>
		</section>
	{/if}

	<section class="quick-links">
		<h3 class="section-title">Quick Links</h3>
		<div class="links-grid">
			<a href="/clinic" class="quick-link-card">
				<Card>
					<div class="quick-link-content">
						<span class="quick-link-icon" aria-hidden="true">
							<svg viewBox="0 0 32 32" fill="none">
								<rect x="6" y="14" width="20" height="14" fill="var(--color-cream-300)" rx="2" />
								<polygon points="4,14 16,5 28,14" fill="var(--color-terracotta-300)" />
								<rect x="13" y="18" width="6" height="10" fill="var(--color-bark-300)" />
							</svg>
						</span>
						<span class="quick-link-label">Visit Clinic</span>
						<span class="quick-link-desc">See your cozy space</span>
					</div>
				</Card>
			</a>

			<a href="/shop" class="quick-link-card">
				<Card>
					<div class="quick-link-content">
						<span class="quick-link-icon" aria-hidden="true">
							<svg viewBox="0 0 32 32" fill="none">
								<path d="M8 6L5 10v14a2 2 0 002 2h18a2 2 0 002-2V10l-3-4H8z" fill="var(--color-sage-200)" stroke="var(--color-sage-400)" stroke-width="1.5" />
								<line x1="5" y1="10" x2="27" y2="10" stroke="var(--color-sage-400)" stroke-width="1.5" />
								<path d="M20 14a4 4 0 01-8 0" stroke="var(--color-sage-400)" stroke-width="1.5" fill="none" />
							</svg>
						</span>
						<span class="quick-link-label">Shop</span>
						<span class="quick-link-desc">Upgrade your clinic</span>
					</div>
				</Card>
			</a>
		</div>
	</section>

	<footer class="cozy-footer">
		<p class="cozy-quote">
			"Every small step forward is a step toward finding your voice."
		</p>
	</footer>

	{#if toast}
		<div class="toast toast-{toast.type}" role="alert">
			<span>{toast.message}</span>
		</div>
	{/if}
</div>

<style>
	.dashboard {
		max-width: 600px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.welcome-section {
		text-align: center;
	}

	.greeting {
		font-family: var(--font-display);
		font-size: 1.75rem;
		color: var(--color-bark-500);
		margin: 0 0 0.5rem 0;
	}

	.welcome-message {
		font-size: 0.9375rem;
		color: var(--color-bark-400);
		line-height: 1.6;
		margin: 0;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--color-bark-500);
		margin: 0 0 1rem 0;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-header .section-title {
		margin: 0;
	}

	.view-all-link {
		font-size: 0.875rem;
		color: var(--color-sage-500);
		text-decoration: none;
		font-weight: 600;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0.5rem;
	}

	.stat-icon {
		width: 2rem;
		height: 2rem;
		margin-bottom: 0.5rem;
	}

	.stat-icon svg {
		width: 100%;
		height: 100%;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-bark-500);
	}

	.stat-label {
		font-size: 0.6875rem;
		color: var(--color-bark-400);
		margin-top: 0.125rem;
	}

	.habits-preview {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.habit-preview-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.habit-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.habit-name {
		font-weight: 600;
		color: var(--color-bark-500);
	}

	.habit-reward {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--color-terracotta-500);
		font-weight: 600;
	}

	.coin-mini {
		width: 0.875rem;
		height: 0.875rem;
	}

	.coin-mini svg {
		width: 100%;
		height: 100%;
	}

	.habit-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.streak-mini {
		font-size: 0.75rem;
		color: var(--color-terracotta-500);
		background-color: var(--color-terracotta-100);
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-weight: 600;
	}

	.streak-mini::before {
		content: '🔥';
		margin-right: 0.125rem;
	}

	.quick-complete-btn {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 2px solid var(--color-sage-400);
		background-color: var(--color-cream-50);
		color: var(--color-sage-500);
		font-weight: bold;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quick-complete-btn:hover {
		background-color: var(--color-sage-500);
		color: white;
		transform: scale(1.1);
	}

	.quick-complete-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.habits-cta {
		margin-top: 1rem;
		text-align: center;
	}

	.manage-link {
		color: var(--color-sage-500);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.manage-link:hover {
		text-decoration: underline;
	}

	.all-done-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1rem;
	}

	.all-done-icon {
		width: 3rem;
		height: 3rem;
		margin-bottom: 0.75rem;
	}

	.all-done-icon svg {
		width: 100%;
		height: 100%;
	}

	.all-done-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--color-sage-600);
		margin: 0 0 0.5rem 0;
	}

	.all-done-message {
		font-size: 0.875rem;
		color: var(--color-bark-400);
		margin: 0;
	}

	.empty-habits-card {
		text-align: center;
		padding: 1rem;
	}

	.empty-message {
		color: var(--color-bark-400);
		margin: 0 0 1rem 0;
	}

	.empty-habits-card a {
		text-decoration: none;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.quick-link-card {
		text-decoration: none;
		display: block;
	}

	.quick-link-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0.5rem;
	}

	.quick-link-icon {
		width: 2.5rem;
		height: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.quick-link-icon svg {
		width: 100%;
		height: 100%;
	}

	.quick-link-label {
		font-weight: 600;
		color: var(--color-bark-500);
		font-size: 0.9375rem;
	}

	.quick-link-desc {
		font-size: 0.75rem;
		color: var(--color-bark-400);
		margin-top: 0.125rem;
	}

	.cozy-footer {
		text-align: center;
		padding: 1rem 0;
	}

	.cozy-quote {
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-style: italic;
		color: var(--color-bark-300);
		margin: 0;
	}

	.toast {
		position: fixed;
		bottom: 5rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-cottage);
		font-weight: 600;
		box-shadow: var(--shadow-cottage-lg);
		animation: toast-pop 0.3s ease;
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

	@keyframes toast-pop {
		0% {
			opacity: 0;
			transform: translateX(-50%) scale(0.9);
		}
		100% {
			opacity: 1;
			transform: translateX(-50%) scale(1);
		}
	}
</style>
