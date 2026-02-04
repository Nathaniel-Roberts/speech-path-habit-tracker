<script lang="ts">
	import type { Habit } from '$lib/game/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		habit: Habit;
		onComplete: (habitId: string) => void;
	}

	let { habit, onComplete }: Props = $props();

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

	let completedToday = $derived(isToday(habit.lastCompleted));

	function handleComplete() {
		if (!completedToday) {
			onComplete(habit.id);
		}
	}
</script>

<Card class="habit-card">
	<div class="habit-content">
		<div class="habit-header">
			<h3 class="habit-name">{habit.name}</h3>
			{#if habit.streak > 0}
				<span class="streak-badge">
					<span class="streak-icon">🔥</span>
					<span class="streak-count">{habit.streak}</span>
				</span>
			{/if}
		</div>

		<div class="habit-details">
			<span class="coin-reward">
				<span class="coin-icon">🪙</span>
				<span class="coin-amount">+{habit.coinReward}</span>
			</span>
			<span class="recurrence-badge">{habit.recurrence}</span>
		</div>

		<div class="habit-actions">
			<Button
				variant={completedToday ? 'secondary' : 'primary'}
				disabled={completedToday}
				onclick={handleComplete}
			>
				{completedToday ? 'Completed' : 'Complete'}
			</Button>
		</div>
	</div>
</Card>

<style>
	:global(.habit-card) {
		border-left: 4px solid var(--color-sage-400);
	}

	.habit-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.habit-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.habit-name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-bark-500);
		margin: 0;
	}

	.streak-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background-color: var(--color-terracotta-100);
		color: var(--color-terracotta-500);
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.streak-icon {
		font-size: 0.875rem;
	}

	.habit-details {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.coin-reward {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--color-terracotta-400);
		font-weight: 600;
	}

	.coin-icon {
		font-size: 1rem;
	}

	.coin-amount {
		font-size: 0.875rem;
	}

	.recurrence-badge {
		display: inline-block;
		background-color: var(--color-sage-100);
		color: var(--color-sage-600);
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.habit-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.25rem;
	}
</style>
