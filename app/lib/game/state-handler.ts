import { GameState } from "@/app/lib/game/types";

export type StateChangedHandler = (newState: GameState, oldState: GameState) => void;

export default class StateHandler {
	listeners: Set<StateChangedHandler> = new Set<StateChangedHandler>();
	_state: GameState = GameState.TITLE;

	setState(newState: GameState) {
		if (newState !== this._state) {
			const oldState = this._state;
			this._state = newState;
			this.listeners.forEach((f) => f(newState, oldState));
		}
	}

	get state() {
		return this._state;
	}

	bindOnStateChange(f: StateChangedHandler) {
		if (!this.listeners.has(f)) this.listeners.add(f);
	}

	unbindOnStateChange(f: StateChangedHandler) {
		if (this.listeners.has(f)) this.listeners.delete(f);
	}
}