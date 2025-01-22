import { Position, UI } from "@/app/lib/game/types";

export type ButtonConfig = {
	center: Position;
	width: number;
	height: number;
	text: string;
	scale?: number;
}

export type TextConfig = {
	color: string;
	align?: CanvasTextAlign;
	baseline?: CanvasTextBaseline;
	text: string;
	pos: Position;
	fontHeight: number;
}

class UIMock implements UI {
	render(ctx: CanvasRenderingContext2D) { ctx.save(); ctx.restore(); }
	handleClick() {}
}

export function drawText(ctx: CanvasRenderingContext2D, config: TextConfig) {
	// handle optionals
	const align = config.align ? config.align : 'start';
	const baseline = config.baseline ? config.baseline : 'hanging';

	// do the actual text
	ctx.save();

	ctx.font = `${config.fontHeight}px silkscreen`;
	ctx.fillStyle = config.color;
	ctx.textAlign = align;
	ctx.textBaseline = baseline;
	ctx.fillText(config.text, config.pos.x, config.pos.y);

	ctx.restore();
}

export function drawButton(ctx: CanvasRenderingContext2D, config: ButtonConfig) {
  ctx.save();

  const clampedScale = Math.max(Math.min(config.scale ? config.scale : 1, 1), 0);
  const width = config.width * clampedScale;
  const height = config.height * clampedScale;
  const left = config.center.x - Math.floor(width / 2);
  const top = config.center.y - Math.floor(height / 2);

  // Make a black background so no stars show through
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(left, top, width, height);

  // Make the button outline
  ctx.strokeStyle = '#eee';
  ctx.strokeRect(left, top, width, height);

  // Fill in the text for the button
	drawText(ctx, {
		color: '#eee',
		align: 'center',
		baseline: 'middle',
		text: config.text,
		pos: new Position(config.center.x, config.center.y),
		fontHeight:  Math.floor(20 * clampedScale)
	});

  ctx.restore();
}

export function makeMockUI(): UI { return new UIMock(); }