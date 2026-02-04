import type { PageServerLoad } from './$types';
import { loadUpgrades } from '$lib/server/config-loader';
import { loadSave } from '$lib/server/save-manager';
import type { Upgrade } from '$lib/game/types';

export const load: PageServerLoad = async () => {
	const { upgrades } = loadUpgrades();
	const save = loadSave();

	// Get all purchased upgrades with their details
	const purchasedUpgrades = save.purchasedUpgrades
		.map((key) => upgrades.find((u: Upgrade) => u.key === key))
		.filter((u): u is Upgrade => u !== undefined);

	// Calculate totals by effect type
	const stats = {
		clientCapacity: {
			base: 5,
			bonus: 0,
			sources: [] as { name: string; value: number }[]
		},
		satisfactionPercent: {
			base: 0,
			bonus: 0,
			sources: [] as { name: string; value: number }[]
		},
		incomeMultiplier: {
			base: 1,
			bonus: 0,
			sources: [] as { name: string; value: number }[]
		}
	};

	for (const upgrade of purchasedUpgrades) {
		if (upgrade.effects.clientCapacity) {
			stats.clientCapacity.bonus += upgrade.effects.clientCapacity;
			stats.clientCapacity.sources.push({
				name: upgrade.name,
				value: upgrade.effects.clientCapacity
			});
		}
		if (upgrade.effects.satisfactionPercent) {
			stats.satisfactionPercent.bonus += upgrade.effects.satisfactionPercent;
			stats.satisfactionPercent.sources.push({
				name: upgrade.name,
				value: upgrade.effects.satisfactionPercent
			});
		}
		if (upgrade.effects.incomeMultiplier) {
			stats.incomeMultiplier.bonus += upgrade.effects.incomeMultiplier;
			stats.incomeMultiplier.sources.push({
				name: upgrade.name,
				value: upgrade.effects.incomeMultiplier
			});
		}
	}

	// Group purchased upgrades by category
	const upgradesByCategory = {
		assessment: purchasedUpgrades.filter((u) => u.category === 'assessment'),
		tool: purchasedUpgrades.filter((u) => u.category === 'tool'),
		decor: purchasedUpgrades.filter((u) => u.category === 'decor'),
		staff: purchasedUpgrades.filter((u) => u.category === 'staff'),
		expansion: purchasedUpgrades.filter((u) => u.category === 'expansion')
	};

	return {
		stats,
		upgradesByCategory,
		totalUpgrades: purchasedUpgrades.length,
		totalSpent: purchasedUpgrades.reduce((sum, u) => sum + u.cost, 0)
	};
};
