import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loadSave, validateSave, importSave, resetSave } from '$lib/server/save-manager';

export const load: PageServerLoad = async () => {
	const save = loadSave();

	// Calculate days playing
	const createdAt = new Date(save.gameState.createdAt);
	const now = new Date();
	const daysPlaying = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;

	// Calculate total completions
	const totalCompletions = save.completions.length;

	// Calculate best streak across all habits
	const bestStreak = save.habits.reduce((max, habit) => Math.max(max, habit.longestStreak), 0);

	return {
		coins: save.gameState.coins,
		lifetimeCoins: save.gameState.lifetimeCoins,
		clientsSeen: save.gameState.clientsSeen,
		habitsCount: save.habits.length,
		completionsCount: totalCompletions,
		upgradesCount: save.purchasedUpgrades.length,
		daysPlaying,
		bestStreak,
		createdAt: save.gameState.createdAt
	};
};

export const actions: Actions = {
	import: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('saveFile') as File | null;

		if (!file || file.size === 0) {
			return fail(400, {
				action: 'import',
				error: 'No file uploaded'
			});
		}

		// Check file type
		if (!file.name.endsWith('.json')) {
			return fail(400, {
				action: 'import',
				error: 'File must be a .json file'
			});
		}

		try {
			const text = await file.text();
			const data = JSON.parse(text);

			// Validate the save data
			if (!validateSave(data)) {
				return fail(400, {
					action: 'import',
					error: 'Invalid save file format. The file may be corrupted or from an incompatible version.'
				});
			}

			// Import the save
			const result = importSave(data);

			if (!result.success) {
				return fail(400, {
					action: 'import',
					error: result.error || 'Failed to import save'
				});
			}

			return {
				action: 'import',
				success: true,
				message: 'Save imported successfully! Your progress has been restored.'
			};
		} catch (e) {
			return fail(400, {
				action: 'import',
				error: 'Failed to parse file. Please ensure it is a valid JSON file.'
			});
		}
	},

	reset: async ({ request }) => {
		const formData = await request.formData();
		const confirmation = formData.get('confirmation') as string;

		if (confirmation !== 'RESET') {
			return fail(400, {
				action: 'reset',
				error: 'Please type "RESET" to confirm'
			});
		}

		try {
			resetSave();

			return {
				action: 'reset',
				success: true,
				message: 'Save reset successfully. Your journey begins anew!'
			};
		} catch (e) {
			return fail(500, {
				action: 'reset',
				error: 'Failed to reset save. Please try again.'
			});
		}
	}
};
