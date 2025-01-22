'use client';

import GameCanvas from "@/app/ui/game-canvas";
import { useEffect } from "react";
import AudioHandler from "@/app/lib/game/audio-handle";

/**
 * This game is snake. We will have high scores saved in both local storage
 * and also have a postgreSQL database set up so save global
 * scores. Global high scores can use IP address.
 */
export default function Page() {
	useEffect(() => {
		return () => {
			AudioHandler.stopSong();
		}
	})
	return (
		<>
			<h1 className="text-6xl mb-6">Snake Game</h1>
			<div className="hidden sm:flex justify-center w-full bg-gradient-to-r from-transparent via-slate-900 to-transparent">
				<div className="w-1/2 lg:w-2/3">
					<GameCanvas />
				</div>
			</div>
			<p className="inline sm:hidden">
				This game is not supported on mobile. Sorry!
			</p>
		</>
	);
}