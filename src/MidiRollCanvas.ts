import { MidiCanvas } from './MidiCanvas'

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
	}

	beginFrame() {
		this.clear();
		this.drawNoteGrid();
	}

	endFrame() {
		// Nothing to do
	}

	drawMeasure(start, end) {
		this.graphics.beginPath()

		let startX = this.getX(start)
		let endX   = this.getX(end)

		let measureWidth = this.getW(this.ticks_per_beat);
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

	clear() {
		this.graphics.fillStyle = "black";
		this.graphics.fillRect(0, 0, 1000, 1000)
	}

	drawNoteGrid() {
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

	drawBeatGrid() {
		this.graphics.beginPath()
		let beatWidth = this.getW(1/4);
		for(let x = 0; x < this.canvas.width; x += beatWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()

		this.graphics.beginPath()
		let eigthWidth = this.getW(1/8);
		for(let x = 0; x < this.canvas.width; x += eigthWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()
	}

	getX(beat) { return this.getW(beat) }
	getY(beat) { return this.getH(beat - this.minNote) }
	getW(beats) { return beats * 4 * 60 }
	getH(beats) {
		let step = this.graphics.canvas.height / (this.maxNote - this.minNote);
		return beats * step
	}
}
