'use client';

import { useEffect, useRef } from "react";
import SnakeGame from "@/app/lib/game/snake-game";
import { GRID_WIDTH, GRID_HEIGHT } from "@/app/lib/game/consts";
import { useClientMediaQuery } from "@/app/lib/hooks/use-client-media-query";

export default function GameCanvas() {
	const canvasRef = useRef(null);
	const renderIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const gameRef = useRef<SnakeGame | null>(null);
	const isMobile = useClientMediaQuery('(max-width: 640px)');

	const getContext = (): CanvasRenderingContext2D | null => {
		if (!canvasRef.current) return null;
		const get2dContext = (el: HTMLCanvasElement) => el.getContext('2d');
		return get2dContext(canvasRef.current);
	}

	useEffect(() => {
		// Early-out if we are on mobile.
		if (isMobile) {
			gameRef.current?.forceStop();
			if (renderIntervalRef.current !== null) clearInterval(renderIntervalRef.current);
			return () => {};
		}

		const ctx = getContext();
		if (!ctx) return;

		const render = () => {
			const ctx = getContext();
			if (!ctx) return;

			gameRef.current?.render(ctx);
		}

		// if we have a game already for some reason, just init it again
		if (gameRef.current) gameRef.current.init();
		else gameRef.current = new SnakeGame(ctx.canvas.width, ctx.canvas.height);
		// Set up the game tick
		renderIntervalRef.current = setInterval(() => {
			render();
		}, 50);

		// render immediately
		render();

		// Bind event listeners
		ctx.canvas.onclick = gameRef.current?.handleClick.bind(gameRef.current);

		return () => {
			if (renderIntervalRef.current !== null) clearInterval(renderIntervalRef.current);
			gameRef.current?.forceStop();
		}
	}, [isMobile]);

	return (
		<canvas
			id="snakeGameCanvas"
			className="w-full h-full"
			width={GRID_WIDTH}
			height={GRID_HEIGHT}
			ref={canvasRef}
		/>
	);
}