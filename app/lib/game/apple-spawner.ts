import { GRID_SIZE, GRID_WIDTH, GRID_HEIGHT } from "@/app/lib/game/consts";
import Apple from "@/app/lib/game/apple";
import { Position } from "@/app/lib/game/types";

export default class AppleSpawner {
	validSpawns: Set<string> = new Set<string>();

	constructor() {
		this.init();
	}

	init() {
		const gridWidth = GRID_WIDTH/GRID_SIZE;
		const gridHeight = GRID_HEIGHT/GRID_SIZE;
		for (let x = 0; x < gridWidth; ++x) {
			for (let y = 0; y <gridHeight; ++y) {
				this.validSpawns.add(`${x},${y}`);
			}
		}
	}

	spawnApple() {
		// Get a random valid position
		const spawnsArr = Array.from(this.validSpawns);
		const spawn = spawnsArr[Math.floor(Math.random() * spawnsArr.length)];
		const x = parseInt(spawn.split(',')[0]);
		const y = parseInt(spawn.split(',')[1]);

		return new Apple(new Position( x, y ));
	}

	validateSpawn(spawn: Position) {
		const str = spawn.toString();
		if (!this.validSpawns.has(str)) this.validSpawns.add(str);
	}

	invalidateSpawn(spawn: Position) {
		const str = spawn.toString();
		if (this.validSpawns.has(str)) this.validSpawns.delete(str);
	}
}