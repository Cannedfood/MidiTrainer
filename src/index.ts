import { MidiRollCanvas } from './MidiRollCanvas'
import { DrumTrainer } from './DrumTrainer'

let midiCanvas = new MidiRollCanvas(document.querySelector("#midi-canvas"))
let drumTrainer = new DrumTrainer()
drumTrainer.canvas = midiCanvas

function draw() {
	// midiCanvas.time += (bpm/60)/fps;
	midiCanvas.beginFrame();
	// midiCanvas.drawMeasure(0, 12, 4);
	midiCanvas.drawNote(2, Math.ceil(midiCanvas.time) + 3, 1/8);
	midiCanvas.endFrame();
}

draw()
