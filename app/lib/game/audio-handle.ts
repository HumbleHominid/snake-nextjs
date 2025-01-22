export enum AudioSongRef {
	TitleMusic,
	GameMusic,
	GameOverMusic,
}

const audioSongMap: Map<AudioSongRef, string> = new Map<AudioSongRef, string>([
	[AudioSongRef.TitleMusic, "/audio/title.wav"],
	[AudioSongRef.GameMusic, "/audio/game.wav"],
	[AudioSongRef.GameOverMusic, "/audio/title.wav"],
]);

export enum AudioSfxRef {
	AppleEat,
	ButtonClick,
	GameOver,
	SnakeMove
}

const audioSfxMap: Map<AudioSfxRef, string> = new Map<AudioSfxRef, string>([
	[AudioSfxRef.AppleEat, "/audio/apple.mp3"],
	[AudioSfxRef.ButtonClick, "/audio/button.wav"],
	[AudioSfxRef.GameOver, "/audio/gameover.wav"],
]);

export default class AudioHandler {
	// Have to do this typeof checking since this is a static property. Should probably make this not static but having the AudioHandler be a static class is super handy.
	private static curSong: HTMLAudioElement | null = (typeof Audio === "undefined") ? null : new Audio();

	private static audioMap: Map<string, HTMLAudioElement> = new Map<string, HTMLAudioElement>();

	static isSameSong(audioRef: AudioSongRef): boolean {
		const src = audioSongMap.get(audioRef);
		if (src === undefined) return false;
		return this.curSong ? this.curSong.src.endsWith(src) : false;
	}

	static playSong(audioRef: AudioSongRef) {
		// early-out if same song
		if (this.isSameSong(audioRef)) {
			// If it's paused for some reason start it
			if (this.curSong?.paused) this.curSong.play();
			return;
		}
		// early-out if we don't have it mapped
		const src = audioSongMap.get(audioRef);
		if (src === undefined) return;

		this.curSong?.pause();
		// If we have already fetched the song before, just restart it
		if (this.audioMap.has(src)) {
			const audio = this.audioMap.get(src);
			if (audio !== undefined) {
				audio.currentTime = 0;
				audio.play();
				this.curSong = audio;
			}
			else {
				this.curSong?.play();
			}
		}
		// Otherwise make a new element and add it to the map
		else {
			const audio = new Audio(src);
			audio.volume = 0.25;
			audio.loop = true;
			audio.autoplay = true;
			this.curSong = audio;

			this.audioMap.set(src, audio);
		}
	}

	static playSfx(audioRef: AudioSfxRef, shouldLoop: boolean = false) {
		// early-out if we don't have it mapped
		const src = audioSfxMap.get(audioRef);
		if (src === undefined) return;

		// If we have already fetched the sfx before, just restart it
		if (this.audioMap.has(src)) {
			const audio = this.audioMap.get(src);
			if (audio !== undefined) {
				audio.pause();
				audio.currentTime = 0;
				audio.play();
			}
		}
		// Otherwise make a new element and add it to the map
		else {
			const audio = new Audio(src);
			audio.autoplay = true;
			if (shouldLoop) audio.loop = true;
			this.audioMap.set(src, audio);
		}
	}

	static stopSong() {
		this.curSong?.pause();
	}
}