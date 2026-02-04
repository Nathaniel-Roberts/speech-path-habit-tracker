import type { PageServerLoad } from './$types';
import { loadSave } from '$lib/server/save-manager';
import { getAvailableUpgrades } from '$lib/server/config-loader';

export const load: PageServerLoad = async () => {
	const save = loadSave();
	const upgrades = getAvailableUpgrades();

	return {
		purchasedUpgrades: save.purchasedUpgrades,
		upgrades
	};
};
