import { Application, Graphics, Text, TextStyle, Container, Sprite, Assets } from 'pixi.js';
import type { Upgrade } from '$lib/game/types';

/** Color palette for different upgrade categories */
const CATEGORY_COLORS: Record<Upgrade['category'], number> = {
	assessment: 0x7b9e89, // sage green
	tool: 0xc9a66b, // warm tan
	decor: 0xd4a5a5, // dusty rose
	staff: 0x8fb4c9, // soft blue
	expansion: 0xb9936c // terracotta
};

/** Cream/beige background color (fallback) */
const BACKGROUND_COLOR = 0xfaf5eb;

/** Border/frame color */
const FRAME_COLOR = 0x8b7355;

/** Base dimensions the positions in config are designed for */
const BASE_WIDTH = 280;
const BASE_HEIGHT = 187; // 3:2 aspect ratio

/**
 * ClinicRenderer wraps a PixiJS Application to render
 * the cozy clinic view with purchased upgrades.
 */
export class ClinicRenderer {
	private app: Application | null = null;
	private upgradeContainer: Container | null = null;
	private backgroundSprite: Sprite | null = null;

	/**
	 * Initialize the PixiJS application on a canvas element.
	 * Uses PixiJS v8 async init pattern.
	 */
	async init(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
		this.app = new Application();

		await this.app.init({
			canvas,
			width,
			height,
			backgroundColor: BACKGROUND_COLOR,
			antialias: true,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true
		});

		// Load and draw background
		await this.loadBackground();

		// Create container for upgrade sprites
		this.upgradeContainer = new Container();
		this.app.stage.addChild(this.upgradeContainer);
	}

	/**
	 * Load the background image from static/sprites.
	 */
	async loadBackground(): Promise<void> {
		if (!this.app) return;

		try {
			// Load the background texture
			const texture = await Assets.load('/sprites/clinic_background.png');

			this.backgroundSprite = new Sprite(texture);

			// Scale to fit the canvas
			this.scaleBackground();

			// Add as first child (behind everything else)
			this.app.stage.addChildAt(this.backgroundSprite, 0);
		} catch (error) {
			console.warn('Could not load background image, using fallback:', error);
			this.drawFallbackBackground();
		}
	}

	/**
	 * Scale the background sprite to cover the canvas.
	 */
	private scaleBackground(): void {
		if (!this.app || !this.backgroundSprite) return;

		const { width, height } = this.app.screen;
		const texture = this.backgroundSprite.texture;

		// Scale to cover (like CSS background-size: cover)
		const scaleX = width / texture.width;
		const scaleY = height / texture.height;
		const scale = Math.max(scaleX, scaleY);

		this.backgroundSprite.scale.set(scale);

		// Center the background
		this.backgroundSprite.x = (width - texture.width * scale) / 2;
		this.backgroundSprite.y = (height - texture.height * scale) / 2;
	}

	/**
	 * Draw a fallback background if image fails to load.
	 */
	private drawFallbackBackground(): void {
		if (!this.app) return;

		const { width, height } = this.app.screen;

		const bg = new Graphics();

		// Main background
		bg.rect(0, 0, width, height);
		bg.fill({ color: BACKGROUND_COLOR });

		// Draw decorative frame border
		const frameWidth = 8;
		bg.rect(frameWidth, frameWidth, width - frameWidth * 2, height - frameWidth * 2);
		bg.stroke({ color: FRAME_COLOR, width: 3, alpha: 0.5 });

		// Add corner decorations
		const cornerOffset = frameWidth + 10;
		const cornerSize = 6;

		[
			[cornerOffset, cornerOffset],
			[width - cornerOffset, cornerOffset],
			[cornerOffset, height - cornerOffset],
			[width - cornerOffset, height - cornerOffset]
		].forEach(([x, y]) => {
			bg.circle(x, y, cornerSize);
			bg.fill({ color: FRAME_COLOR, alpha: 0.4 });
		});

		this.app.stage.addChildAt(bg, 0);
	}

	/**
	 * Draw a colored placeholder rectangle with the upgrade name.
	 * Used when real sprites are not available.
	 */
	drawPlaceholder(key: string, name: string, x: number, y: number, category: Upgrade['category']): Container {
		const container = new Container();
		container.x = x;
		container.y = y;

		// Get color based on category
		const color = CATEGORY_COLORS[category] || 0x999999;

		// Draw placeholder rectangle
		const placeholder = new Graphics();
		const boxWidth = 60;
		const boxHeight = 40;

		// Main rectangle with slight transparency
		placeholder.roundRect(0, 0, boxWidth, boxHeight, 6);
		placeholder.fill({ color, alpha: 0.9 });

		// Border
		placeholder.roundRect(0, 0, boxWidth, boxHeight, 6);
		placeholder.stroke({ color: 0x5a4a3a, width: 2, alpha: 0.6 });

		container.addChild(placeholder);

		// Create text label
		const textStyle = new TextStyle({
			fontFamily: 'Georgia, serif',
			fontSize: 9,
			fill: 0xffffff,
			align: 'center',
			wordWrap: true,
			wordWrapWidth: boxWidth - 8
		});

		const text = new Text({
			text: name,
			style: textStyle
		});

		// Center text in the box
		text.x = (boxWidth - text.width) / 2;
		text.y = (boxHeight - text.height) / 2;

		container.addChild(text);

		return container;
	}

	/**
	 * Render all purchased upgrades that have position data.
	 * Clears any existing upgrade renders first.
	 */
	async renderUpgrades(purchasedKeys: string[], allUpgrades: Upgrade[]): Promise<void> {
		if (!this.app || !this.upgradeContainer) return;

		// Clear existing upgrade graphics
		this.upgradeContainer.removeChildren();

		// Create a map for quick lookup
		const upgradeMap = new Map(allUpgrades.map((u) => [u.key, u]));

		// Calculate scale based on canvas size
		const scaleX = this.app.screen.width / BASE_WIDTH;
		const scaleY = this.app.screen.height / BASE_HEIGHT;

		// Render each purchased upgrade that has position data
		for (const key of purchasedKeys) {
			const upgrade = upgradeMap.get(key);

			if (!upgrade || !upgrade.position) {
				// Skip upgrades without position (like expansions)
				continue;
			}

			const scaledX = upgrade.position.x * scaleX;
			const scaledY = upgrade.position.y * scaleY;

			// Try to load actual sprite, fall back to placeholder
			const spriteContainer = await this.loadUpgradeSprite(upgrade, scaledX, scaledY, scaleX, scaleY);
			this.upgradeContainer.addChild(spriteContainer);
		}
	}

	/**
	 * Load an upgrade sprite or fall back to placeholder.
	 */
	private async loadUpgradeSprite(
		upgrade: Upgrade,
		x: number,
		y: number,
		scaleX: number,
		scaleY: number
	): Promise<Container> {
		if (!upgrade.sprite) {
			return this.drawPlaceholder(upgrade.key, upgrade.name, x, y, upgrade.category);
		}

		try {
			const texture = await Assets.load(`/sprites/${upgrade.sprite}`);
			const sprite = new Sprite(texture);

			const container = new Container();
			container.x = x;
			container.y = y;

			// Scale sprite to fit nicely (target ~60px wide at base scale)
			const targetWidth = 60 * ((scaleX + scaleY) / 2);
			const spriteScale = targetWidth / texture.width;
			sprite.scale.set(spriteScale);

			container.addChild(sprite);
			return container;
		} catch (error) {
			// Sprite not found, use placeholder
			console.log(`Sprite not found for ${upgrade.key}, using placeholder`);
			return this.drawPlaceholder(upgrade.key, upgrade.name, x, y, upgrade.category);
		}
	}

	/**
	 * Get the current canvas dimensions.
	 */
	getSize(): { width: number; height: number } | null {
		if (!this.app) return null;
		return {
			width: this.app.screen.width,
			height: this.app.screen.height
		};
	}

	/**
	 * Resize the renderer to new dimensions.
	 */
	resize(width: number, height: number): void {
		if (!this.app) return;
		this.app.renderer.resize(width, height);

		// Re-scale background
		this.scaleBackground();
	}

	/**
	 * Clean up the PixiJS application and all resources.
	 */
	destroy(): void {
		if (this.app) {
			this.app.destroy(true, { children: true, texture: true });
			this.app = null;
			this.upgradeContainer = null;
			this.backgroundSprite = null;
		}
	}
}
