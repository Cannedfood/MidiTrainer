import { MidiRollCanvas } from './MidiRollCanvas'
import { DrumTrainer } from './DrumTrainer'

let midiCanvas = new MidiRollCanvas(document.querySelector("#midi-canvas"))
let drumTrainer = new DrumTrainer()
drumTrainer.canvas = midiCanvas

midiCanvas.clear()
midiCanvas.drawNoteGrid()
midiCanvas.drawBeatGrid()
midiCanvas.drawMeasure(0, 12, 4/4);
midiCanvas.drawNote(2, 1, 1/8)
