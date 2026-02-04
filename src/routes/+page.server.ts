import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { loadSave, writeSave } from '$lib/server/save-manager';

export const actions: Actions = {
	complete: async ({ request }) => {
		const formData = await request.formData();
		const habitId = formData.get('habitId') as string;

		if (!habitId) {
			return fail(400, { error: 'Habit ID required' });
		}

		const save = loadSave();
		const habit = save.habits.find((h) => h.id === habitId);

		if (!habit) {
			return fail(404, { error: 'Habit not found' });
		}

		// Check if already completed today
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (habit.lastCompleted) {
			const lastCompleted = new Date(habit.lastCompleted);
			lastCompleted.setHours(0, 0, 0, 0);
			if (lastCompleted.getTime() === today.getTime()) {
				return fail(400, { error: 'Already completed today' });
			}
		}

		// Calculate streak
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (habit.lastCompleted) {
			const lastCompleted = new Date(habit.lastCompleted);
			lastCompleted.setHours(0, 0, 0, 0);
			if (lastCompleted.getTime() === yesterday.getTime()) {
				habit.streak += 1;
			} else {
				habit.streak = 1;
			}
		} else {
			habit.streak = 1;
		}

		// Update longest streak
		if (habit.streak > habit.longestStreak) {
			habit.longestStreak = habit.streak;
		}

		// Update last completed
		habit.lastCompleted = new Date().toISOString();

		// Award coins
		const coinsAwarded = habit.coinReward;
		save.gameState.coins += coinsAwarded;
		save.gameState.lifetimeCoins += coinsAwarded;

		// Add completion record
		save.completions.push({
			id: crypto.randomUUID(),
			habitId: habit.id,
			completedAt: habit.lastCompleted,
			coinsAwarded
		});

		writeSave(save);

		return {
			success: true,
			habitName: habit.name,
			coinsAwarded,
			newStreak: habit.streak
		};
	}
};
