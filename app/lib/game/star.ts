import { Position } from "@/app/lib/game/types";

export default class Star {
	pos: Position;
	isAlive: boolean = false;
	timeout: NodeJS.Timeout | null = null;

	constructor(pos: Position) {
		this.pos = pos;
	}

	toString() : string {
		return this.pos.toString();
	}

	init() {
		// Minimum time in seconds a star can be on for
		const minTime = 5;
		// Maximum time in seconds a star can be on for
		const maxTime = 10;
		// Time in seconds that this star is alive for
		const displayTime = (minTime + Math.floor(Math.random() * (maxTime - minTime)));

		this.isAlive = true;
		this.timeout = setTimeout(() => {
			this.isAlive = false;
		}, displayTime * 1000);
	}
}