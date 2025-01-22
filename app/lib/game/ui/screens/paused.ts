import { Position, UI, ClickHandler } from "@/app/lib/game/types";
import { drawText } from "@/app/lib/game/ui/ui-helpers";
import Buttons from "@/app/lib/game/ui/buttons";
import { CANVAS_COLOR, DEFAULT_TEXT_COLOR, GRID_HEIGHT, GRID_WIDTH } from "@/app/lib/game/consts";

export type ScoreGetterHandler = () => number;

export default class UIPaused implements UI {
	buttons: Buttons = new Buttons();
	onResumeClicked: Set<ClickHandler> = new Set<ClickHandler>;

	scoreGetter: ScoreGetterHandler = () => 0;

	constructor() {
		// Make back button
		{
			const buttonHeight = 50;
			const buttonScale = 0.75;
			this.buttons.add({
					width: 150,
					height: buttonHeight,
					scale: buttonScale,
					center: new Position(GRID_WIDTH / 2, GRID_HEIGHT - (buttonHeight * buttonScale)),
					text: 'RESUME'
				},
				() => this.onResumeClicked.forEach((callback) => callback(), this)
			);
		}
	}

	bindScoreGetter(scoreGetter: ScoreGetterHandler) {
		this.scoreGetter = scoreGetter;
	}

	get score() { return this.scoreGetter(); }

	handleClick(e: MouseEvent) { this.buttons.handleClick(e); }

	bindOnResumeClick(e: ClickHandler) {
		if (!this.onResumeClicked.has(e)) this.onResumeClicked.add(e);
	}

	unbindOnResumeClick(e: ClickHandler) {
		if (this.onResumeClicked.has(e)) this.onResumeClicked.delete(e);
	}

	render(ctx: CanvasRenderingContext2D) {
		const gap = 15;
		const headingSize = 60;
		const centerX = Math.floor(ctx.canvas.width / 2);

		// Large Title
		{
			const gameoverText = 'Paused';
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

		// Score
		// HACK Copied from game.ts BAD. Make component like with the buttons
		{
			const gap = 5;
			const fontHeight = 12;

			// shadow text
			drawText(ctx, {
				color: '#008f11',
				text: `Score: ${this.score}`,
				pos: new Position(gap + 1, gap + 1),
				fontHeight: fontHeight
			});

			// main text
			drawText(ctx, {
				color: '#00ff41',
				text: `Score: ${this.score}`,
				pos: new Position(gap + 1, gap + 1),
				fontHeight: fontHeight
			});
		}

		// buttons
		this.buttons.render(ctx);
	}
}