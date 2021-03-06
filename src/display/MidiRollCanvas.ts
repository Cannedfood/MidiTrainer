import { IMidiCanvas } from './IMidiCanvas'

/// Draws midi data as
export default
class MidiRollCanvas implements IMidiCanvas {
	minTime: number;
	maxTime: number;
	minNote: number;
	maxNote: number;

	canvas: HTMLCanvasElement;
	graphics: CanvasRenderingContext2D;

	noteColor: string;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.graphics = canvas.getContext("2d")
		this.minNote = 0;
		this.maxNote = 8;
		this.minTime = 0;
		this.maxTime = 4 * 3; // 3 Measures

		this.noteColor = "black";

		// Set to correct resolution
		let dpi = window.devicePixelRatio;
		let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
		let style_width  = +getComputedStyle(canvas).getPropertyValue("width" ).slice(0, -2);
		canvas.setAttribute('height', `${style_height * dpi}`);
		canvas.setAttribute('width',  `${style_width  * dpi}`);
	}

	beginFrame() {
		this.clear();
		this.drawNoteGrid();
	}

	endFrame() {
		// Nothing to do
		// this.drawBeatGrid()
	}

	drawMeasure(start: number, end: number, beatsPerMeasure: number) {
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
		this.graphics.fillStyle = this.noteColor;
		console.log("Note at " + position + "ms for " + duration + "ms")
		console.log("     x = " + this.getX(position) + " w = " + this.getW(duration))
		this.graphics.fillRect(
			this.getX(position), this.getY(note),
			this.getW(duration), this.getH(1)
		);
	}

	private clear() {
		this.graphics.fillStyle = "black";
		this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height)
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
		let lowestBeatX = this.getX(Math.ceil(this.minTime));
		let highestBeatX = this.getX(Math.floor(this.maxTime));

		for(let x = lowestBeatX; x < highestBeatX; x += beatWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()

		this.graphics.beginPath()
		let eigthWidth = this.getW(.5);
		for(let x = lowestBeatX; x < highestBeatX; x += eigthWidth) {
			this.graphics.moveTo(x, 0);
			this.graphics.lineTo(x, this.canvas.height)
		}
		this.graphics.strokeStyle = "gray";
		this.graphics.stroke()
	}

	private getX(beat: number) { return this.getW(beat - this.minTime) }
	private getY(note: number) { return this.getH(note - this.minNote) }
	private getW(beats: number) { return (beats / (this.maxTime - this.minTime)) * this.canvas.width }
	private getH(notes: number) {
		let step = this.graphics.canvas.height / (this.maxNote - this.minNote);
		return notes * step
	}
}
