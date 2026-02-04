import { readFileSync } from 'fs';
import { join } from 'path';
import type {
	UpgradesConfig,
	StreakRewardsConfig,
	SettingsConfig,
	Upgrade
} from '$lib/game/types';

const CONFIG_DIR = process.env.CONFIG_DIR || './config';

// Cache configs in memory (safe because they're read-only)
let upgradesCache: UpgradesConfig | null = null;
let streakRewardsCache: StreakRewardsConfig | null = null;
let settingsCache: SettingsConfig | null = null;

export function loadUpgrades(): UpgradesConfig {
	if (!upgradesCache) {
		const path = join(CONFIG_DIR, 'upgrades.json');
		const raw = readFileSync(path, 'utf-8');
		upgradesCache = JSON.parse(raw) as UpgradesConfig;
	}
	return upgradesCache;
}

export function loadStreakRewards(): StreakRewardsConfig {
	if (!streakRewardsCache) {
		const path = join(CONFIG_DIR, 'streakRewards.json');
		const raw = readFileSync(path, 'utf-8');
		streakRewardsCache = JSON.parse(raw) as StreakRewardsConfig;
	}
	return streakRewardsCache;
}

export function loadSettings(): SettingsConfig {
	if (!settingsCache) {
		const path = join(CONFIG_DIR, 'settings.json');
		const raw = readFileSync(path, 'utf-8');
		settingsCache = JSON.parse(raw) as SettingsConfig;
	}
	return settingsCache;
}

export function getUpgrade(key: string): Upgrade | undefined {
	const { upgrades } = loadUpgrades();
	return upgrades.find((u) => u.key === key);
}

export function getAvailableUpgrades(): Upgrade[] {
	return loadUpgrades().upgrades;
}

export function getUpgradesByCategory(category: Upgrade['category']): Upgrade[] {
	return loadUpgrades().upgrades.filter((u) => u.category === category);
}

export function getAllCategories(): Upgrade['category'][] {
	return ['assessment', 'tool', 'decor', 'staff', 'expansion'];
}

// Clear caches (useful for testing or hot reload)
export function clearConfigCache(): void {
	upgradesCache = null;
	streakRewardsCache = null;
	settingsCache = null;
}
