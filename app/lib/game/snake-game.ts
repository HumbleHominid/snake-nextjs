import Starfield from "@/app/lib/game/starfield";
import { GameState, Position, Renderable, Tickable, UI } from "@/app/lib/game/types";
import Snake from "@/app/lib/game/snake";
import { CANVAS_COLOR, GRID_SIZE, INPUT_MAP } from "@/app/lib/game/consts";
import AppleSpawner from "@/app/lib/game/apple-spawner";
import Apple from "@/app/lib/game/apple";
import StateHandler from "@/app/lib/game/state-handler";
import UIFactory from "@/app/lib/game/ui/ui-factory";
import UIGame from "@/app/lib/game/ui/screens/game";
import UIGameOver from "@/app/lib/game/ui/screens/game-over";
import UIPaused from "@/app/lib/game/ui/screens/paused";
import { makeMockUI } from "@/app/lib/game/ui/ui-helpers";
import AudioHandler, { AudioSfxRef, AudioSongRef } from "./audio-handle";

/**
 * The actual snake game
 */
export default class SnakeGame {
	width: number;
	height: number;
	isInitialized: boolean = false;

	// ref to the input handler so we can remove it later
	playerInputHandler: ((e: KeyboardEvent) => void) | null = null;
	// ref to the state change handlers so we can remove it later
	stateChangedHandler: ((oldState: GameState, newState: GameState) => void) | null = null;

	// Game Objects
	snake: Snake = new Snake(new Position(0, 0), () => {}, () => {}, () => {} );
	apple: Apple = new Apple(new Position(0, 0));
	appleSpawner: AppleSpawner = new AppleSpawner();

	ui: UI = makeMockUI();

	ticking: Set<Tickable> = new Set<Tickable>();
	rendering: Set<Renderable> = new Set<Renderable>();
	tickInterval: NodeJS.Timeout | null = null;

	_score: number = 0;

	stateHandler: StateHandler = new StateHandler();
	get isGameOver() { return this.stateHandler.state === GameState.GAMEOVER; }

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.init();
	}

	init() {
		if (this.isInitialized) return;
		this.isInitialized = true;
		/**
		 * Since we are using a component array, it's very important that we push things
		 * into the array in the correct order otherwise stuff will render on the
		 * wrong z-level in the canvas and it look bad
		 */
		const starfield = new Starfield(this.width, this.height);
		this.ticking.add(starfield);
		this.rendering.add(starfield);
		// make a new ticking interval
		if (this.tickInterval !== null) clearInterval(this.tickInterval);
		this.tickInterval = setInterval(() => {
			this.tick();
		}, 75);
		this.bindPlayerInput();

		// Bind UI
		this.stateChangedHandler = this.handleStateChange.bind(this);
		this.stateHandler.bindOnStateChange(this.stateChangedHandler);
		this.stateChangedHandler(GameState.TITLE, GameState.TITLE); // HACK
	}

	forceStop() {
		this.isInitialized = false;
		this.stateHandler.setState(GameState.TITLE);
		this.unbindPlayerInput();
		this.ticking.clear();
		this.rendering.clear();
		// stop the ticking interval completely
		if (this.tickInterval !== null) clearInterval(this.tickInterval);
		AudioHandler.stopSong();
		if (this.stateChangedHandler) {
			this.stateHandler.unbindOnStateChange(this.handleStateChange);
			this.stateChangedHandler = null;
		}
	}

	handleStateChange(newState: GameState, oldState: GameState) {
		// Cleanup old UI
		if (this.ui) {
			// Remove the old ui from the rendering list if it's there
			if (this.rendering.has(this.ui)) this.rendering.delete(this.ui);
		}

		// Create new UI and update the references
		const newUI = UIFactory.makeUI(newState, this.stateHandler);

		// Any additional setup we need to do here that can't be done in the factory for whatever reason
		switch (this.stateHandler.state) {
			case GameState.TITLE:
				// Clean up the tick/render queue for safety
				if (this.rendering.has(this.snake)) this.rendering.delete(this.snake);
				if (this.rendering.has(this.apple)) this.rendering.delete(this.apple);
				if (this.ticking.has(this.snake)) this.ticking.delete(this.snake);
				// Music
				if (this.isInitialized) AudioHandler.playSong(AudioSongRef.TitleMusic);
				break;
			case GameState.PLAYING:
				// If we have dangling references in the render pipeline, remove them
				[this.snake, this.apple].forEach((item) => {
					if (this.rendering.has(item)) this.rendering.delete(item);
				});
				// Set up the UI
				const gameUI = newUI as UIGame;
				gameUI.bindScoreGetter(() => this.score);
				// Set up the game
				if (oldState !== GameState.PAUSED) {
					this._score = 0;
					// initialize the apple spawner
					const appleSpawner = new AppleSpawner();
					this.appleSpawner = appleSpawner;
					// Player
					const playerX = Math.floor(this.width/GRID_SIZE/2);
					const playerY = Math.floor(this.height/GRID_SIZE/2);
					const snake = new Snake(
						new Position(playerX, playerY),
						appleSpawner.invalidateSpawn.bind(appleSpawner),
						appleSpawner.validateSpawn.bind(appleSpawner),
						() => this.stateHandler.setState(GameState.GAMEOVER)
					);
					this.snake = snake;

					// Apple
					const apple = appleSpawner.spawnApple();
					this.apple = apple;
				}

				// Always add the snake back to ticking. (Reenables after pause and from other menus)
				this.ticking.add(this.snake);
				// Always add apple and snake back to rendering. same as above
				this.rendering.add(this.snake);
				this.rendering.add(this.apple);

				this.snake.bindInput();
				// Music
				if (this.isInitialized) AudioHandler.playSong(AudioSongRef.GameMusic);
				break;
			case GameState.GAMEOVER:
				this.snake.unbindInput();
				// Stop ticking the snake so it "freezes" on screen. keep the stars ticking
				if (this.ticking.has(this.snake)) this.ticking.delete(this.snake);
				const GameOverUI = newUI as UIGameOver;
				GameOverUI.bindScoreGetter(() => this.score);
				// Music
				setTimeout(() => {
					if (this.isInitialized) AudioHandler.playSong(AudioSongRef.TitleMusic);
				}, 50);
				break;
			case GameState.PAUSED:
				this.snake.unbindInput();
				// Stop ticking the snake so it "freezes" on screen. keep the stars ticking
				if (this.ticking.has(this.snake)) this.ticking.delete(this.snake);
				const pausedUI = newUI as UIPaused;
				pausedUI.bindScoreGetter(() => this.score);
				break;
			case GameState.CONTROLS:
				// Catches the case of user navigating directly to /game and the browser prevents autoplaying music
				if (this.isInitialized) AudioHandler.playSong(AudioSongRef.TitleMusic);
				break;
		}

		this.ui = newUI;
		this.rendering.add(newUI);
	}

	get score() { return this._score; }

	getScore() { return this.score; }

	handleGameover() {
		this.ticking.delete(this.snake);
	}

	handleInput(e: KeyboardEvent) {
		if (e.code === INPUT_MAP.Pause) {
			switch (this.stateHandler.state) {
				case GameState.PLAYING:
					this.stateHandler.setState(GameState.PAUSED);
					AudioHandler.playSfx(AudioSfxRef.ButtonClick);
					break;
				case GameState.PAUSED:
					this.stateHandler.setState(GameState.PLAYING);
					AudioHandler.playSfx(AudioSfxRef.ButtonClick);
					break;
				case GameState.GAMEOVER:
					this.stateHandler.setState(GameState.TITLE);
					AudioHandler.playSfx(AudioSfxRef.ButtonClick);
					break;
			}
		}
	}

	bindPlayerInput() {
		this.playerInputHandler = this.handleInput.bind(this);
		document.addEventListener("keydown", this.playerInputHandler);
	}

	unbindPlayerInput() {
		if (this.playerInputHandler) {
			document.removeEventListener("keydown", this.playerInputHandler);
			this.playerInputHandler = null;
		}
		this.snake.unbindInput();
	}

	handleClick(e: MouseEvent) {
		this.ui?.handleClick(e);
	}

	tick() {
		this.ticking.forEach((tickable) => tickable.tick());

		/**
		 * Player eating apple logic. Only do this if we are running the game
		 */
		if (this.stateHandler.state === GameState.PLAYING) {
			if (this.snake.head?.equals(this.apple.pos)) {
				this.snake.eatApple();
				this._score += 1;
				// Do something with the score
				// Spawn a new apple
				this.rendering.delete(this.apple);
				this.apple = this.appleSpawner.spawnApple();
				// HACK Make sure the UI is always rendered last
				if (this.rendering.has(this.ui)) this.rendering.delete(this.ui);
				this.rendering.add(this.apple);
				this.rendering.add(this.ui);
			}
		}
	}

	render(ctx: CanvasRenderingContext2D) {
		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		// Draw background
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = CANVAS_COLOR;
		ctx.fillRect(0, 0, width, height);

		// Render all our components
		this.rendering.forEach((rendering) => rendering.render(ctx));

		ctx.restore();
	}
}