export interface Habit {
	id: string;
	name: string;
	coinReward: number;
	recurrence: 'daily' | 'weekly' | 'one-off';
	streak: number;
	longestStreak: number;
	lastCompleted: string | null;
	createdAt: string;
}

export interface Completion {
	id: string;
	habitId: string;
	completedAt: string;
	coinsAwarded: number;
}

export interface GameState {
	coins: number;
	lifetimeCoins: number;
	clientsSeen: number;
	lastIdleTick: string;
	createdAt: string;
}

export interface SaveData {
	version: number;
	exportedAt: string;
	gameState: GameState;
	habits: Habit[];
	completions: Completion[];
	purchasedUpgrades: string[];
	claimedStreakRewards: Record<string, number[]>;
}

export interface UpgradeEffect {
	clientCapacity?: number;
	satisfactionPercent?: number;
	incomeMultiplier?: number;
}

export interface Upgrade {
	key: string;
	category: 'assessment' | 'tool' | 'decor' | 'staff' | 'expansion';
	name: string;
	description: string;
	cost: number;
	effects: UpgradeEffect;
	sprite: string | null;
	position: { x: number; y: number } | null;
}

export interface UpgradesConfig {
	upgrades: Upgrade[];
}

export interface StreakMilestone {
	days: number;
	coins: number;
	message: string;
}

export interface StreakRewardsConfig {
	milestones: StreakMilestone[];
}

export interface IdleSettings {
	baseClientsPerHour: number;
	maxIdleHours: number;
	baseCoinsPerClient: number;
}

export interface HabitSettings {
	maxCoinReward: number;
	defaultRecurrence: 'daily' | 'weekly' | 'one-off';
}

export interface SettingsConfig {
	idleSettings: IdleSettings;
	habitSettings: HabitSettings;
	startingCoins: number;
}

export interface IdleRewardResult {
	coins: number;
	clients: number;
	timeElapsedMs: number;
	capped: boolean;
}
