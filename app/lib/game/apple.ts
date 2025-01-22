import { GameObject, Position } from "@/app/lib/game/types";
import { GRID_SIZE } from "@/app/lib/game/consts";

export default class Apple implements GameObject {
	pos: Position;

	constructor(pos: Position) {
		this.pos = pos;
	}

	tick() { }

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.fillStyle = '#f00';

		let { x, y } = this.pos;
		x *= GRID_SIZE;
		y *= GRID_SIZE;

		ctx.fillRect(
			x,
			y,
			GRID_SIZE,
			GRID_SIZE
		);

		ctx.restore();
	}
}