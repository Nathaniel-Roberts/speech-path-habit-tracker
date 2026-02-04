import type { LayoutServerLoad } from './$types';
import { loadSave, writeSave } from '$lib/server/save-manager';
import { loadUpgrades, loadSettings, loadStreakRewards } from '$lib/server/config-loader';
import { calculateIdleRewards } from '$lib/server/idle-calculator';

export const load: LayoutServerLoad = async () => {
	const save = loadSave();
	const upgrades = loadUpgrades();
	const settings = loadSettings();
	const streakRewards = loadStreakRewards();

	// Calculate idle rewards
	const idleRewards = calculateIdleRewards(save);

	// If there are idle rewards, apply them to the save
	if (idleRewards.coins > 0) {
		save.gameState.coins += idleRewards.coins;
		save.gameState.lifetimeCoins += idleRewards.coins;
		save.gameState.clientsSeen += idleRewards.clients;
		save.gameState.lastIdleTick = new Date().toISOString();
		writeSave(save);
	}

	return {
		save,
		config: {
			upgrades,
			settings,
			streakRewards
		},
		idleRewards
	};
};
