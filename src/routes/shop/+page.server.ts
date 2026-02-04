import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loadSave, writeSave } from '$lib/server/save-manager';
import { getAvailableUpgrades, getUpgrade } from '$lib/server/config-loader';

export const load: PageServerLoad = async () => {
	const save = loadSave();
	const upgrades = getAvailableUpgrades();

	return {
		upgrades,
		purchasedUpgrades: save.purchasedUpgrades,
		coins: save.gameState.coins
	};
};

export const actions: Actions = {
	purchase: async ({ request }) => {
		const formData = await request.formData();
		const upgradeKey = formData.get('upgradeKey');

		if (typeof upgradeKey !== 'string' || !upgradeKey) {
			return fail(400, {
				error: 'Invalid upgrade key',
				upgradeKey: null
			});
		}

		// Validate upgrade exists
		const upgrade = getUpgrade(upgradeKey);
		if (!upgrade) {
			return fail(404, {
				error: 'Upgrade not found',
				upgradeKey
			});
		}

		// Load current save
		const save = loadSave();

		// Check if already owned
		if (save.purchasedUpgrades.includes(upgradeKey)) {
			return fail(400, {
				error: 'Upgrade already owned',
				upgradeKey
			});
		}

		// Check if user has enough coins
		if (save.gameState.coins < upgrade.cost) {
			return fail(400, {
				error: 'Not enough coins',
				upgradeKey,
				required: upgrade.cost,
				available: save.gameState.coins
			});
		}

		// Deduct coins and add upgrade
		save.gameState.coins -= upgrade.cost;
		save.purchasedUpgrades.push(upgradeKey);

		// Save changes
		writeSave(save);

		return {
			success: true,
			upgrade: upgradeKey,
			newBalance: save.gameState.coins
		};
	}
};
