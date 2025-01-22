import { Position, UI, ClickHandler } from "@/app/lib/game/types";
import { drawText } from "@/app/lib/game/ui/ui-helpers";
import { CANVAS_COLOR, DEFAULT_TEXT_COLOR, GRID_HEIGHT, GRID_WIDTH } from "@/app/lib/game/consts";
import Buttons from "@/app/lib/game/ui/buttons";

export type ScoreGetterHandler = () => number;

export default class UIControls implements UI {
	buttons: Buttons = new Buttons();
	onBackClicked: Set<ClickHandler> = new Set<ClickHandler>;

	constructor() {
		// Make back button
		{
			const buttonHeight = 50;
			const buttonScale = 0.75;
			this.buttons.add({
					width: 150,
					height: buttonHeight,
					scale: buttonScale,
					center: new Position(GRID_WIDTH / 2, GRID_HEIGHT - (buttonHeight * buttonScale) ),
					text: 'BACK'
				},
				() => this.onBackClicked.forEach((callback) => callback(), this)
			);
		}
	}

	handleClick(e: MouseEvent) { this.buttons.handleClick(e); }

	bindOnBackClick(e: ClickHandler) {
		if (!this.onBackClicked.has(e)) this.onBackClicked.add(e);
	}

	unbindOnBackClick(e: ClickHandler) {
		if (this.onBackClicked.has(e)) this.onBackClicked.delete(e);
	}

	render(ctx: CanvasRenderingContext2D) {
		const gap = 15;
		const headingSize = 60;
		const centerX = Math.floor(ctx.canvas.width / 2);

		// Large Title
		{
			const gameoverText = 'Controls';
			// shadow text
			drawText(ctx, {
				color: CANVAS_COLOR,
				text: gameoverText,
				pos: new Position(centerX + 3, gap + 3),
				fontHeight: headingSize,
				align: 'center'
			});

			// main text
			drawText(ctx, {
				color: DEFAULT_TEXT_COLOR,
				text: gameoverText,
				pos: new Position(centerX, gap),
				fontHeight: headingSize,
				align: 'center'
			});
		}

		// Controls
		{
			const controls = [
				{ key: "↑", action: "Up"},
				{ key: "↓", action: "Down"},
				{ key: "←", action: "Left"},
				{ key: "→", action: "Right"},
				{ key: "Esc", action: "Pause"}
			];
			const controlTextSize = 20;
			// offset the top of the list by the heading and then a larger space
			let offset = gap + headingSize + (2*gap);

			controls.forEach((mapping) => {
				// We use individual left/right renders here so it looks nice and centered on what we want
				// Text
				{
					const text = `${mapping.action}`;
					// shadow text
					drawText(ctx, {
						color: CANVAS_COLOR,
						text: text,
						pos: new Position(centerX + 2, offset + 2),
						fontHeight: controlTextSize,
						align: 'right'
					});

					// main text
					drawText(ctx, {
						color: DEFAULT_TEXT_COLOR,
						text: text,
						pos: new Position(centerX, offset),
						fontHeight: controlTextSize,
						align: 'right'
					});
				}
				// Key Binding
				{
					const text = `: ${mapping.key}`;
					// shadow text
					drawText(ctx, {
						color: CANVAS_COLOR,
						text: text,
						pos: new Position(centerX + 2, offset + 2),
						fontHeight: controlTextSize,
						align: 'left'
					});

					// main text
					drawText(ctx, {
						color: DEFAULT_TEXT_COLOR,
						text: text,
						pos: new Position(centerX, offset),
						fontHeight: controlTextSize,
						align: 'left'
					});
				}

				offset += controlTextSize + (0.1 * controlTextSize);
			});
		}

		// buttons
		this.buttons.render(ctx);
	}
}