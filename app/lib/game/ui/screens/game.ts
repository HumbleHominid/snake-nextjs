import { Position, UI } from "@/app/lib/game/types";
import { drawText } from "@/app/lib/game/ui/ui-helpers";

export type ScoreGetterHandler = () => number;

export default class UIGame implements UI {
	scoreGetter: ScoreGetterHandler = () => 0;

	bindScoreGetter(scoreGetter: ScoreGetterHandler) {
		this.scoreGetter = scoreGetter;
	}

	get score() { return this.scoreGetter(); }

	handleClick() { }

	render(ctx: CanvasRenderingContext2D) {
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
}