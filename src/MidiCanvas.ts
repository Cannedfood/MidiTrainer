/// Provides an interface for drawing notes, for example as a piano roll or music sheet
export interface MidiCanvas {
	time: number; // The current time in ticks_per_beat
	minNote: number; // Minimum note the canvas has to draw
	maxNote: number; // Maximum note the canvas has to draw

	beginFrame(): void;
	drawMeasure(start: number, end: number, beatsPerMeasure: number): void;
	drawNote(at: number, duration: number, value: number, data: any): void;
	endFrame(): void;
}
