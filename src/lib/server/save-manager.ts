import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import type { SaveData } from '$lib/game/types';
import { loadSettings } from './config-loader';

const DATA_DIR = process.env.DATA_DIR || './data';
const SAVE_PATH = join(DATA_DIR, 'save.json');
const BACKUP_DIR = join(DATA_DIR, 'backups');
const MAX_BACKUPS = 3;

function ensureDirectories(): void {
	if (!existsSync(DATA_DIR)) {
		mkdirSync(DATA_DIR, { recursive: true });
	}
	if (!existsSync(BACKUP_DIR)) {
		mkdirSync(BACKUP_DIR, { recursive: true });
	}
}

function createDefaultSave(): SaveData {
	const settings = loadSettings();
	const now = new Date().toISOString();

	return {
		version: 1,
		exportedAt: now,
		gameState: {
			coins: settings.startingCoins,
			lifetimeCoins: 0,
			clientsSeen: 0,
			lastIdleTick: now,
			createdAt: now
		},
		habits: [],
		completions: [],
		purchasedUpgrades: [],
		claimedStreakRewards: {}
	};
}

export function loadSave(): SaveData {
	ensureDirectories();

	if (!existsSync(SAVE_PATH)) {
		const defaultSave = createDefaultSave();
		writeSave(defaultSave, false); // Don't backup on first create
		return defaultSave;
	}

	try {
		const raw = readFileSync(SAVE_PATH, 'utf-8');
		return JSON.parse(raw) as SaveData;
	} catch (error) {
		console.error('Failed to load save file, creating new one:', error);
		const defaultSave = createDefaultSave();
		writeSave(defaultSave, false);
		return defaultSave;
	}
}

function rotateBackups(): void {
	ensureDirectories();

	const backups = readdirSync(BACKUP_DIR)
		.filter((f) => f.startsWith('save-') && f.endsWith('.json'))
		.sort()
		.reverse();

	// Remove old backups beyond MAX_BACKUPS - 1 (to make room for new one)
	while (backups.length >= MAX_BACKUPS) {
		const oldest = backups.pop();
		if (oldest) {
			unlinkSync(join(BACKUP_DIR, oldest));
		}
	}
}

export function writeSave(data: SaveData, backup: boolean = true): void {
	ensureDirectories();

	// Backup current save first
	if (backup && existsSync(SAVE_PATH)) {
		rotateBackups();
		const timestamp = Date.now();
		copyFileSync(SAVE_PATH, join(BACKUP_DIR, `save-${timestamp}.json`));
	}

	data.exportedAt = new Date().toISOString();
	writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function validateSave(data: unknown): data is SaveData {
	if (typeof data !== 'object' || data === null) return false;

	const save = data as Record<string, unknown>;

	// Check required top-level fields
	if (typeof save.version !== 'number') return false;
	if (typeof save.exportedAt !== 'string') return false;
	if (typeof save.gameState !== 'object' || save.gameState === null) return false;
	if (!Array.isArray(save.habits)) return false;
	if (!Array.isArray(save.completions)) return false;
	if (!Array.isArray(save.purchasedUpgrades)) return false;
	if (typeof save.claimedStreakRewards !== 'object' || save.claimedStreakRewards === null)
		return false;

	// Check gameState fields
	const gs = save.gameState as Record<string, unknown>;
	if (typeof gs.coins !== 'number') return false;
	if (typeof gs.lifetimeCoins !== 'number') return false;
	if (typeof gs.clientsSeen !== 'number') return false;
	if (typeof gs.lastIdleTick !== 'string') return false;
	if (typeof gs.createdAt !== 'string') return false;

	return true;
}

export function resetSave(): SaveData {
	// Backup before reset
	if (existsSync(SAVE_PATH)) {
		rotateBackups();
		const timestamp = Date.now();
		copyFileSync(SAVE_PATH, join(BACKUP_DIR, `save-${timestamp}.json`));
	}

	const defaultSave = createDefaultSave();
	writeSave(defaultSave, false);
	return defaultSave;
}

export function importSave(data: unknown): { success: boolean; error?: string; save?: SaveData } {
	if (!validateSave(data)) {
		return { success: false, error: 'Invalid save file format' };
	}

	// Backup current save before import
	writeSave(data);
	return { success: true, save: data };
}

export function getSavePath(): string {
	return SAVE_PATH;
}
