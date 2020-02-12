export
interface MidiCanvas {
	time: number; // The current time in ticks_per_beat
	ticks_per_beat: number;
	minNote: number; // Minimum note the canvas has to draw
	maxNote: number; // Maximum note the canvas has to draw

	beginFrame(): void;
	drawMeasure(start: number, end: number): void;
	drawNote(at: number, duration: number, value: number, data: any): void;
	endFrame(): void;
}
