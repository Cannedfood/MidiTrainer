import { MidiCanvas } from './MidiCanvas'

/// Draws midi data as
export class MidiRollCanvas implements MidiCanvas {
	time: number;
	ticks_per_beat: number;
	minNote: number;
	maxNote: number;

	canvas: HTMLCanvasElement;
	graphics: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.graphics = canvas.getContext("2d")
		this.minNote = 0;
		this.maxNote = 8;
		this.time = 0;
	}

	beginFrame() {
		this.clear();
		this.drawNoteGrid();
	}

	endFrame() {
		// Nothing to do
		this.drawBeatGrid()
	}

	drawMeasure(start, end, beatsPerMeasure) {
		this.graphics.beginPath()

		let startX = this.getX(start)
		let endX   = this.getX(end)

		let measureWidth = this.getW(beatsPerMeasure);
		for(let x = startX; x < endX; x += measureWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "white";
		this.graphics.lineWidth = 2;
		this.graphics.stroke()
		this.graphics.lineWidth = 1;
	}

	drawNote(note: number, position: number, duration: number) {
		this.graphics.fillStyle = "gray";
		this.graphics.fillRect(
			this.getX(position), this.getY(note),
			this.getW(duration), this.getH(1)
		);
	}

	private clear() {
		this.graphics.fillStyle = "black";
		this.graphics.fillRect(0, 0, 1000, 1000)
	}

	private drawNoteGrid() {
		this.graphics.beginPath()
		for(let i = this.minNote; i <= this.maxNote; i++) {
			let y = this.getY(i);
			this.graphics.moveTo(0, y);
			this.graphics.lineTo(this.graphics.canvas.width, y)
		}
		this.graphics.strokeStyle = "white";
		this.graphics.lineWidth = 1;
		this.graphics.stroke()
	}

	private drawBeatGrid() {
		this.graphics.beginPath()
		let beatWidth = this.getW(1);
		for(let x = this.getX(Math.floor(this.time)); x < this.canvas.width; x += beatWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()

		this.graphics.beginPath()
		let eigthWidth = this.getW(.5);
		for(let x = this.getX(Math.floor(this.time)); x < this.canvas.width; x += eigthWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()
	}

	private getX(beat: number) { return this.getW(beat - this.time) }
	private getY(note: number) { return this.getH(note - this.minNote) }
	private getW(beats: number) { return beats * 60 }
	private getH(notes: number) {
		let step = this.graphics.canvas.height / (this.maxNote - this.minNote);
		return notes * step
	}
}
