import Star from "@/app/lib/game/star";
import { GameObject, Position } from "@/app/lib/game/types";

export default class Starfield implements GameObject {
	ctxWidth : number;
	ctxHeight : number;
	/**
	 * Set of star.toString().
	 * If a star.toString() is in this set, it means it is in stars as well.
	 * We use parallel data structures as default Set implementation uses
	 * references and I don't wanna code a whole wrapper class just for this one
	 * little thing so two structures is fine.
	 */
	litStars : Set<string>;
	stars: Array<Star>;

	constructor(width: number, height: number) {
		this.ctxWidth = width;
		this.ctxHeight = height;
		this.stars = [];
		this.litStars = new Set<string>();
	}

	tick() {
		// filter the stars array so we only have the alive ones. Also update
		// the litStars set if we have to
		this.stars = this.stars.filter((star) => {
			if (!star.isAlive) this.litStars.delete(star.toString());
			return star.isAlive;
		});

		// we will attempt to create between [0, maxNewStars)
		const maxNewStars = 4;
		const numStars = Math.floor(Math.random()*(maxNewStars+1));

		// Create the new stars if possible and add them to the data structures
		for (let i = 0; i < numStars; ++i) {
			const x = Math.floor(Math.random()*this.ctxWidth);
			const y = Math.floor(Math.random()*this.ctxHeight);
			const star = new Star(new Position(x, y));

			if (this.litStars.has(star.toString())) continue;

			star.init();
			this.litStars.add(star.toString());
			this.stars.push(star);
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.fillStyle = '#eee';

		this.stars.forEach((star) => {
			const { x, y } = star.pos;
			ctx.fillRect(x, y, 1, 1);
		});

		ctx.restore();
	}
}