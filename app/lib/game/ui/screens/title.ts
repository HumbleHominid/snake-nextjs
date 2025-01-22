import { Position, UI, ClickHandler } from "@/app/lib/game/types";
import { drawText } from "@/app/lib/game/ui/ui-helpers";
import { CANVAS_COLOR, DEFAULT_TEXT_COLOR, GRID_HEIGHT, GRID_WIDTH } from "@/app/lib/game/consts";
import Buttons from "@/app/lib/game/ui/buttons";

export default class UITitle implements UI {
	buttons: Buttons = new Buttons();
	onPlayClicked: Set<ClickHandler> = new Set<ClickHandler>;
	onControlsClicked: Set<ClickHandler> = new Set<ClickHandler>;

	constructor() {
		let topOffset = 175;
		const buttonHeight = 50;
		const buttonGap = 0.25 * buttonHeight;
		// Make play button
		this.buttons.add({
				width: 150,
				height: buttonHeight,
				center: new Position(GRID_WIDTH/2, topOffset),
				text: 'PLAY'
			},
			() => this.onPlayClicked.forEach((callback) => callback(), this)
		);
		topOffset += buttonHeight + buttonGap;
		// Make controls button
		this.buttons.add({
			width: 150,
			height: buttonHeight,
			scale: 0.75,
			center: new Position(GRID_WIDTH/2, topOffset),
			text: 'CONTROLS'
		},
		() => this.onControlsClicked.forEach((callback) => callback(), this)
	);
	}

	handleClick(e: MouseEvent) { this.buttons.handleClick(e); }

	bindOnPlayClick(e: ClickHandler) {
		if (!this.onPlayClicked.has(e)) this.onPlayClicked.add(e);
	}

	unbindOnPlayClick(e: ClickHandler) {
		if (this.onPlayClicked.has(e)) this.onPlayClicked.delete(e);
	}

	bindOnControlsClick(e: ClickHandler) {
		if (!this.onControlsClicked.has(e)) this.onControlsClicked.add(e);
	}

	unbindOnControlsClick(e: ClickHandler) {
		if (this.onControlsClicked.has(e)) this.onControlsClicked.delete(e);
	}

	render(ctx: CanvasRenderingContext2D) {
		const centerX = Math.floor(ctx.canvas.width / 2);
		let topOffset = 15;

		// Title
		{
			const titleText = 'Snake Game';
			const fontSize = 50;
			// shadow text
			drawText(ctx, {
				color: CANVAS_COLOR,
				text: titleText,
				pos: new Position(centerX + 3, topOffset + 3),
				fontHeight: fontSize,
				align: 'center'
			});

			// main text
			drawText(ctx, {
				color: DEFAULT_TEXT_COLOR,
				text: titleText,
				pos: new Position(centerX, topOffset),
				fontHeight: fontSize,
				align: 'center'
			});

			topOffset += fontSize;
		}

		// Sub title
		{
			const subTitleText = 'Definitely an original game';
			const fontSize = 15;
			// shadow text
			drawText(ctx, {
				color: CANVAS_COLOR,
				text: subTitleText,
				pos: new Position(centerX + 2, topOffset + 2),
				fontHeight: fontSize,
				align: 'center'
			});

			// main text
			drawText(ctx, {
				color: DEFAULT_TEXT_COLOR,
				text: subTitleText,
				pos: new Position(centerX, topOffset),
				fontHeight: fontSize,
				align: 'center'
			});

			topOffset += fontSize;
		}

		// credits
		{
			const credits = [
				'Programmed by: Michael Fryer',
				'Music by: JCD',
			];
			const fontSize = 10;
			let bottomOffset = 5;

			credits.reverse().forEach((text) => {
				// shadow text
				drawText(ctx, {
					color: CANVAS_COLOR,
					text: text,
					pos: new Position(centerX + 1, GRID_HEIGHT - bottomOffset + 1),
					fontHeight: fontSize,
					align: 'center',
					baseline: 'bottom'
				});

				// main text
				drawText(ctx, {
					color: DEFAULT_TEXT_COLOR,
					text: text,
					pos: new Position(centerX, GRID_HEIGHT - bottomOffset),
					fontHeight: fontSize,
					align: 'center',
					baseline: 'bottom'
				});

				bottomOffset += fontSize;
			})
		}

		// buttons
		this.buttons.render(ctx);
	}
}