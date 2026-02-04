import type { Actions, PageServerLoad } from './$types';
import { loadSave, writeSave } from '$lib/server/save-manager';
import type { Habit, Completion } from '$lib/game/types';

export const load: PageServerLoad = async () => {
	const save = loadSave();
	return {
		habits: save.habits,
		coins: save.gameState.coins
	};
};

function isToday(dateString: string): boolean {
	const date = new Date(dateString);
	const today = new Date();
	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	);
}

function isYesterday(dateString: string): boolean {
	const date = new Date(dateString);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return (
		date.getFullYear() === yesterday.getFullYear() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getDate() === yesterday.getDate()
	);
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const coinReward = parseInt(formData.get('coinReward') as string, 10) || 1;
		const recurrence = (formData.get('recurrence') as Habit['recurrence']) || 'daily';

		if (!name?.trim()) {
			return { success: false, error: 'Habit name is required' };
		}

		const save = loadSave();
		const now = new Date().toISOString();

		const newHabit: Habit = {
			id: crypto.randomUUID(),
			name: name.trim(),
			coinReward: Math.min(Math.max(coinReward, 1), 5),
			recurrence,
			streak: 0,
			longestStreak: 0,
			lastCompleted: null,
			createdAt: now
		};

		save.habits.push(newHabit);
		writeSave(save);

		return { success: true, habit: newHabit };
	},

	complete: async ({ request }) => {
		const formData = await request.formData();
		const habitId = formData.get('habitId') as string;

		if (!habitId) {
			return { success: false, error: 'Habit ID is required' };
		}

		const save = loadSave();
		const habitIndex = save.habits.findIndex((h) => h.id === habitId);

		if (habitIndex === -1) {
			return { success: false, error: 'Habit not found' };
		}

		const habit = save.habits[habitIndex];

		// Check if already completed today
		if (habit.lastCompleted && isToday(habit.lastCompleted)) {
			return { success: false, error: 'Habit already completed today' };
		}

		// Calculate new streak
		let newStreak: number;
		if (habit.lastCompleted && isYesterday(habit.lastCompleted)) {
			// Completed yesterday - increment streak
			newStreak = habit.streak + 1;
		} else {
			// First completion or gap in completions - reset to 1
			newStreak = 1;
		}

		const now = new Date().toISOString();

		// Update habit
		save.habits[habitIndex] = {
			...habit,
			streak: newStreak,
			longestStreak: Math.max(habit.longestStreak, newStreak),
			lastCompleted: now
		};

		// Award coins
		const coinsAwarded = habit.coinReward;
		save.gameState.coins += coinsAwarded;
		save.gameState.lifetimeCoins += coinsAwarded;

		// Add completion record
		const completion: Completion = {
			id: crypto.randomUUID(),
			habitId,
			completedAt: now,
			coinsAwarded
		};
		save.completions.push(completion);

		writeSave(save);

		return {
			success: true,
			coinsAwarded,
			newStreak,
			totalCoins: save.gameState.coins
		};
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const habitId = formData.get('habitId') as string;

		if (!habitId) {
			return { success: false, error: 'Habit ID is required' };
		}

		const save = loadSave();
		const habitIndex = save.habits.findIndex((h) => h.id === habitId);

		if (habitIndex === -1) {
			return { success: false, error: 'Habit not found' };
		}

		// Remove the habit
		save.habits.splice(habitIndex, 1);

		// Optionally remove associated completions (keeping them for history)
		// save.completions = save.completions.filter((c) => c.habitId !== habitId);

		writeSave(save);

		return { success: true };
	}
};
