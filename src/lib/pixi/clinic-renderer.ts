import { Application, Graphics, Text, TextStyle, Container } from 'pixi.js';
import type { Upgrade } from '$lib/game/types';

/** Color palette for different upgrade categories */
const CATEGORY_COLORS: Record<Upgrade['category'], number> = {
	assessment: 0x7b9e89, // sage green
	tool: 0xc9a66b, // warm tan
	decor: 0xd4a5a5, // dusty rose
	staff: 0x8fb4c9, // soft blue
	expansion: 0xb9936c // terracotta
};

/** Cream/beige background color */
const BACKGROUND_COLOR = 0xfaf5eb;

/** Border/frame color */
const FRAME_COLOR = 0x8b7355;

/**
 * ClinicRenderer wraps a PixiJS Application to render
 * the cozy clinic view with purchased upgrades.
 */
export class ClinicRenderer {
	private app: Application | null = null;
	private upgradeContainer: Container | null = null;

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

		// Create container for upgrade sprites
		this.upgradeContainer = new Container();
		this.app.stage.addChild(this.upgradeContainer);

		// Draw initial background
		this.drawBackground();
	}

	/**
	 * Draw a simple cream/beige background with a cottagecore frame.
	 */
	drawBackground(): void {
		if (!this.app) return;

		const { width, height } = this.app.screen;

		// Background is already set via backgroundColor, but we can add decoration
		const bg = new Graphics();

		// Draw a subtle inner border/frame
		const frameWidth = 8;
		bg.rect(0, 0, width, height);
		bg.fill({ color: BACKGROUND_COLOR });

		// Draw decorative frame border
		bg.rect(frameWidth, frameWidth, width - frameWidth * 2, height - frameWidth * 2);
		bg.stroke({ color: FRAME_COLOR, width: 3, alpha: 0.5 });

		// Add corner decorations (simple dots for a rustic feel)
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

		// Insert background at the bottom of the stage
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

		// Main rectangle
		placeholder.roundRect(0, 0, boxWidth, boxHeight, 6);
		placeholder.fill({ color, alpha: 0.85 });

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
	renderUpgrades(purchasedKeys: string[], allUpgrades: Upgrade[]): void {
		if (!this.app || !this.upgradeContainer) return;

		// Clear existing upgrade graphics
		this.upgradeContainer.removeChildren();

		// Create a map for quick lookup
		const upgradeMap = new Map(allUpgrades.map((u) => [u.key, u]));

		// Render each purchased upgrade that has position data
		for (const key of purchasedKeys) {
			const upgrade = upgradeMap.get(key);

			if (!upgrade || !upgrade.position) {
				// Skip upgrades without position (like expansions)
				continue;
			}

			// Scale positions based on canvas size
			// Config positions assume a base canvas of ~280x175
			const baseWidth = 280;
			const baseHeight = 175;
			const scaleX = this.app.screen.width / baseWidth;
			const scaleY = this.app.screen.height / baseHeight;

			const scaledX = upgrade.position.x * scaleX;
			const scaledY = upgrade.position.y * scaleY;

			// For now, always draw placeholders since we don't have real sprites
			// In the future, this could check if sprite exists and load it
			const placeholder = this.drawPlaceholder(
				upgrade.key,
				upgrade.name,
				scaledX,
				scaledY,
				upgrade.category
			);

			this.upgradeContainer.addChild(placeholder);
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
	}

	/**
	 * Clean up the PixiJS application and all resources.
	 */
	destroy(): void {
		if (this.app) {
			this.app.destroy(true, { children: true, texture: true });
			this.app = null;
			this.upgradeContainer = null;
		}
	}
}
