import type { SaveData, IdleRewardResult, Upgrade } from '$lib/game/types';
import { loadSettings, loadUpgrades } from './config-loader';

export function calculateIdleRewards(save: SaveData): IdleRewardResult {
	const settings = loadSettings();
	const { upgrades } = loadUpgrades();

	const now = Date.now();
	const lastTick = new Date(save.gameState.lastIdleTick).getTime();
	const elapsed = now - lastTick;

	// Minimum 1 minute offline to get rewards
	if (elapsed < 60_000) {
		return { coins: 0, clients: 0, timeElapsedMs: elapsed, capped: false };
	}

	// Cap at max hours
	const maxElapsedMs = settings.idleSettings.maxIdleHours * 60 * 60 * 1000;
	const effectiveElapsed = Math.min(elapsed, maxElapsedMs);
	const capped = elapsed > maxElapsedMs;

	// Calculate base rates
	let clientsPerHour = settings.idleSettings.baseClientsPerHour;
	let coinsPerClient = settings.idleSettings.baseCoinsPerClient;
	let incomeMultiplier = 1;

	// Apply effects from purchased upgrades
	for (const upgradeKey of save.purchasedUpgrades) {
		const upgrade = upgrades.find((u) => u.key === upgradeKey);
		if (!upgrade) continue;

		if (upgrade.effects.clientCapacity) {
			clientsPerHour += upgrade.effects.clientCapacity * 0.1; // Each capacity adds 0.1 clients/hour
		}
		if (upgrade.effects.satisfactionPercent) {
			coinsPerClient += upgrade.effects.satisfactionPercent * 0.05; // Satisfaction adds to coins/client
		}
		if (upgrade.effects.incomeMultiplier) {
			incomeMultiplier += upgrade.effects.incomeMultiplier;
		}
	}

	// Calculate clients seen during idle time
	const hoursElapsed = effectiveElapsed / (1000 * 60 * 60);
	const clients = Math.floor(clientsPerHour * hoursElapsed);

	// Calculate coins earned
	const baseCoins = clients * coinsPerClient * incomeMultiplier;

	// Streak bonus: 1% per active habit streak
	const activeStreaks = save.habits.filter((h) => h.streak > 0).length;
	const streakMultiplier = 1 + activeStreaks * 0.01;

	const coins = Math.floor(baseCoins * streakMultiplier);

	return {
		coins,
		clients,
		timeElapsedMs: effectiveElapsed,
		capped
	};
}

export function formatIdleTime(ms: number): string {
	const hours = Math.floor(ms / (1000 * 60 * 60));
	const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

	if (hours === 0) {
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	} else if (minutes === 0) {
		return `${hours} hour${hours !== 1 ? 's' : ''}`;
	} else {
		return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}
}
