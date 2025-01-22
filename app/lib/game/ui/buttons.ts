import { UI, ClickHandler } from "@/app/lib/game/types";
import { ButtonConfig, drawButton } from "@/app/lib/game/ui/ui-helpers";
import AudioHandler, { AudioSfxRef } from "@/app/lib/game/audio-handle";

// A collection of buttons that knows how to render themselves and elicit callbacks when clicked
export default class Buttons implements UI {
	buttons: Map<ButtonConfig, () => void> = new Map<ButtonConfig, () => void>;

	add(config: ButtonConfig, callback: ClickHandler) {
		this.buttons.set(config, callback);
	}

	handleClick(e: MouseEvent) {
		const canvas = e.target as HTMLCanvasElement;

		const clickX = e.offsetX / canvas.clientWidth * canvas.width;
		const clickY = e.offsetY / canvas.clientHeight * canvas.height;

		this.buttons.keys().forEach((key: ButtonConfig) => {
			const top = key.center.y - (key.height/2);
			const right = key.center.x + (key.width/2);
			const bottom = key.center.y + (key.height/2);
			const left = key.center.x - (key.width/2);

			// Check if our click is inside the button and if it is do the callbacks
			if (
				clickX <= right &&
				clickX >= left &&
				clickY <= bottom &&
				clickY >= top
			) {
				const callback = this.buttons.get(key);
				AudioHandler.playSfx(AudioSfxRef.ButtonClick);
				if (callback) callback();
			}
		});
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();

		this.buttons.keys().forEach((config) => drawButton(ctx, config));

		ctx.restore();
	}
}