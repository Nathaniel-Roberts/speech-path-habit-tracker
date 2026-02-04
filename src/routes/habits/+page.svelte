<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import type { Habit } from '$lib/game/types';
	import HabitCard from '$lib/components/habits/HabitCard.svelte';
	import HabitForm from '$lib/components/habits/HabitForm.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddForm = $state(false);
	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	let completeFormRef = $state<HTMLFormElement | null>(null);
	let deleteFormRef = $state<HTMLFormElement | null>(null);

	function showToast(message: string, type: 'success' | 'error' = 'success') {
		toast = { message, type };
		setTimeout(() => {
			toast = null;
		}, 3000);
	}

	$effect(() => {
		if (form?.success && 'coinsAwarded' in form) {
			showToast(`+${form.coinsAwarded} coins earned!`, 'success');
		} else if (form?.error) {
			showToast(form.error, 'error');
		}
	});

	function handleComplete(habitId: string) {
		if (completeFormRef) {
			const input = completeFormRef.querySelector('input[name="habitId"]') as HTMLInputElement;
			if (input) {
				input.value = habitId;
				completeFormRef.requestSubmit();
			}
		}
	}

	function handleDelete(habitId: string) {
		if (deleteFormRef && confirm('Are you sure you want to delete this habit?')) {
			const input = deleteFormRef.querySelector('input[name="habitId"]') as HTMLInputElement;
			if (input) {
				input.value = habitId;
				deleteFormRef.requestSubmit();
			}
		}
	}

	function handleFormSubmit(formData: { name: string; coinReward: number; recurrence: string }) {
		const form = document.getElementById('create-habit-form') as HTMLFormElement;
		if (form) {
			const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
			const coinInput = form.querySelector('input[name="coinReward"]') as HTMLInputElement;
			const recurrenceInput = form.querySelector('input[name="recurrence"]') as HTMLInputElement;

			if (nameInput) nameInput.value = formData.name;
			if (coinInput) coinInput.value = formData.coinReward.toString();
			if (recurrenceInput) recurrenceInput.value = formData.recurrence;

			form.requestSubmit();
		}
	}
</script>

<div class="habits-page">
	<header class="page-header">
		<h1>My Habits</h1>
		<div class="header-actions">
			<span class="coin-display">
				<span class="coin-icon">🪙</span>
				<span class="coin-count">{data.coins}</span>
			</span>
			<Button variant="primary" onclick={() => (showAddForm = !showAddForm)}>
				{showAddForm ? 'Cancel' : 'Add Habit'}
			</Button>
		</div>
	</header>

	{#if showAddForm}
		<Card class="add-form-card">
			<h2>New Habit</h2>
			<form
				id="create-habit-form"
				method="POST"
				action="?/create"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							showAddForm = false;
							showToast('Habit created!', 'success');
						}
						await update();
					};
				}}
			>
				<input type="hidden" name="name" value="" />
				<input type="hidden" name="coinReward" value="1" />
				<input type="hidden" name="recurrence" value="daily" />
			</form>
			<HabitForm onSubmit={handleFormSubmit} onCancel={() => (showAddForm = false)} />
		</Card>
	{/if}

	<!-- Hidden forms for actions -->
	<form
		bind:this={completeFormRef}
		method="POST"
		action="?/complete"
		style="display: none;"
		use:enhance
	>
		<input type="hidden" name="habitId" value="" />
	</form>

	<form
		bind:this={deleteFormRef}
		method="POST"
		action="?/delete"
		style="display: none;"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showToast('Habit deleted', 'success');
				}
				await update();
			};
		}}
	>
		<input type="hidden" name="habitId" value="" />
	</form>

	<div class="habits-list">
		{#if data.habits.length === 0}
			<Card class="empty-state">
				<p class="empty-message">No habits yet. Add your first habit to get started!</p>
			</Card>
		{:else}
			{#each data.habits as habit (habit.id)}
				<div class="habit-item">
					<HabitCard {habit} onComplete={handleComplete} />
					<button
						type="button"
						class="delete-button"
						title="Delete habit"
						onclick={() => handleDelete(habit.id)}
					>
						<span class="delete-icon">x</span>
					</button>
				</div>
			{/each}
		{/if}
	</div>

	{#if toast}
		<div class="toast toast-{toast.type}">
			{toast.message}
		</div>
	{/if}
</div>

<style>
	.habits-page {
		max-width: 600px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-family: var(--font-display);
		font-size: 1.75rem;
		color: var(--color-bark-500);
		margin: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.coin-display {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background-color: var(--color-terracotta-100);
		padding: 0.5rem 0.75rem;
		border-radius: 9999px;
		font-weight: 600;
		color: var(--color-terracotta-500);
	}

	.coin-icon {
		font-size: 1.125rem;
	}

	:global(.add-form-card) {
		margin-bottom: 1.5rem;
	}

	:global(.add-form-card) h2 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--color-bark-500);
		margin: 0 0 1rem 0;
	}

	.habits-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.habit-item {
		position: relative;
	}

	.delete-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: none;
		color: var(--color-bark-300);
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.2s ease;
		font-size: 0.875rem;
	}

	.delete-button:hover {
		background-color: var(--color-rose-100);
		color: var(--color-rose-400);
	}

	:global(.empty-state) {
		text-align: center;
		padding: 2rem;
	}

	.empty-message {
		color: var(--color-bark-400);
		margin: 0;
	}

	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-cottage);
		font-weight: 600;
		animation: slide-up 0.3s ease;
		z-index: 1000;
	}

	.toast-success {
		background-color: var(--color-sage-500);
		color: white;
	}

	.toast-error {
		background-color: var(--color-rose-400);
		color: white;
	}

	@keyframes slide-up {
		from {
			transform: translateX(-50%) translateY(1rem);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) translateY(0);
			opacity: 1;
		}
	}
</style>
