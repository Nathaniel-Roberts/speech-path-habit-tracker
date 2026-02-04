<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface HabitFormData {
		name: string;
		coinReward: number;
		recurrence: 'daily' | 'weekly' | 'one-off';
	}

	interface Props {
		onSubmit: (data: HabitFormData) => void;
		initialValues?: Partial<HabitFormData>;
		onCancel?: () => void;
	}

	let { onSubmit, initialValues, onCancel }: Props = $props();

	let name = $state(initialValues?.name ?? '');
	let coinReward = $state(initialValues?.coinReward ?? 1);
	let recurrence = $state<'daily' | 'weekly' | 'one-off'>(initialValues?.recurrence ?? 'daily');

	const recurrenceOptions: Array<{ value: 'daily' | 'weekly' | 'one-off'; label: string }> = [
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'one-off', label: 'One-off' }
	];

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (name.trim()) {
			onSubmit({
				name: name.trim(),
				coinReward,
				recurrence
			});
		}
	}

	function selectCoinReward(value: number) {
		coinReward = value;
	}
</script>

<form class="habit-form" onsubmit={handleSubmit}>
	<div class="form-field">
		<label for="habit-name" class="form-label">Habit Name</label>
		<input
			type="text"
			id="habit-name"
			name="name"
			class="form-input"
			bind:value={name}
			placeholder="e.g., Morning meditation"
			required
		/>
	</div>

	<fieldset class="form-field">
		<legend class="form-label">Coin Reward</legend>
		<div class="coin-buttons" role="group" aria-label="Select coin reward">
			{#each [1, 2, 3, 4, 5] as value}
				<button
					type="button"
					class="coin-button"
					class:coin-button-active={coinReward === value}
					onclick={() => selectCoinReward(value)}
					aria-pressed={coinReward === value}
				>
					<span class="coin-icon">🪙</span>
					<span>{value}</span>
				</button>
			{/each}
		</div>
		<input type="hidden" name="coinReward" value={coinReward} />
	</fieldset>

	<fieldset class="form-field">
		<legend class="form-label">Recurrence</legend>
		<div class="recurrence-buttons" role="group" aria-label="Select recurrence">
			{#each recurrenceOptions as option}
				<button
					type="button"
					class="recurrence-button"
					class:recurrence-button-active={recurrence === option.value}
					onclick={() => (recurrence = option.value)}
					aria-pressed={recurrence === option.value}
				>
					{option.label}
				</button>
			{/each}
		</div>
		<input type="hidden" name="recurrence" value={recurrence} />
	</fieldset>

	<div class="form-actions">
		{#if onCancel}
			<Button type="button" variant="secondary" onclick={onCancel}>
				Cancel
			</Button>
		{/if}
		<Button type="submit" variant="primary" disabled={!name.trim()}>
			{initialValues ? 'Save Changes' : 'Add Habit'}
		</Button>
	</div>
</form>

<style>
	.habit-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border: none;
		padding: 0;
		margin: 0;
	}

	.form-label {
		font-weight: 600;
		color: var(--color-bark-500);
		font-size: 0.9375rem;
	}

	.form-input {
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-cream-300);
		border-radius: var(--radius-cottage);
		font-family: var(--font-body);
		font-size: 1rem;
		background-color: var(--color-cream-50);
		color: var(--color-bark-500);
		transition: border-color 0.2s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-sage-400);
	}

	.form-input::placeholder {
		color: var(--color-bark-300);
	}

	.coin-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.coin-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		border: 2px solid var(--color-cream-300);
		border-radius: var(--radius-cottage);
		background-color: var(--color-cream-50);
		color: var(--color-bark-400);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.coin-button:hover {
		border-color: var(--color-terracotta-300);
		background-color: var(--color-terracotta-100);
	}

	.coin-button-active {
		border-color: var(--color-terracotta-400);
		background-color: var(--color-terracotta-100);
		color: var(--color-terracotta-500);
	}

	.coin-icon {
		font-size: 1rem;
	}

	.recurrence-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.recurrence-button {
		flex: 1;
		padding: 0.625rem 1rem;
		border: 2px solid var(--color-cream-300);
		border-radius: var(--radius-cottage);
		background-color: var(--color-cream-50);
		color: var(--color-bark-400);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.recurrence-button:hover {
		border-color: var(--color-sage-300);
		background-color: var(--color-sage-100);
	}

	.recurrence-button-active {
		border-color: var(--color-sage-400);
		background-color: var(--color-sage-100);
		color: var(--color-sage-600);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
</style>
