import { GameState, UI } from "@/app/lib/game/types";
import StateHandler from "@/app/lib/game/state-handler";
import { makeMockUI } from "@/app/lib/game/ui/ui-helpers";
import UITitle from "@/app/lib/game/ui/screens/title";
import UIGame from "@/app/lib/game/ui/screens/game";
import UIGameOver from "@/app/lib/game/ui/screens/game-over";
import UIControls from "@/app/lib/game/ui/screens/controls";
import UIPaused from "@/app/lib/game/ui/screens/paused";

export default class UIFactory {
	static makeUI(state: GameState, stateHandler: StateHandler): UI {
		switch (state) {
			case GameState.TITLE:
				const titleUI = new UITitle() as UITitle;
				titleUI.bindOnPlayClick(() => stateHandler.setState(GameState.PLAYING));
				titleUI.bindOnControlsClick(() => stateHandler.setState(GameState.CONTROLS));
				return titleUI;
			case GameState.PLAYING:
				const gameUI = new UIGame() as UIGame;
				return gameUI;
			case GameState.GAMEOVER:
				const gameOverUI = new UIGameOver() as UIGameOver;
				gameOverUI.bindOnPlayAgainClick(() => stateHandler.setState(GameState.PLAYING));
				gameOverUI.bindOnTitleClick(() => stateHandler.setState(GameState.TITLE));
				return gameOverUI;
			case GameState.CONTROLS:
				const controlsUI = new UIControls() as UIControls;
				// NOTE should use prev state if you can access this from the pause menu
				controlsUI.bindOnBackClick(() => stateHandler.setState(GameState.TITLE));
				return controlsUI;
			case GameState.PAUSED:
				const pausedUI = new UIPaused() as UIPaused;
				pausedUI.bindOnResumeClick(() => stateHandler.setState(GameState.PLAYING));
				return pausedUI;
			default:
				return makeMockUI();
		}
	}
}