import MidiRollCanvas from './display/MidiRollCanvas'
import MidiData from './midi/MidiData'
import WebMidi from './web/WebMidi'
import MidiParser from 'midi-parser-js'

let playedNotes = new MidiData();
let playedNotesInput = playedNotes.inputStream().setBpm(120).setTimeSignature(4, 4);

WebMidi.connect();
WebMidi.onMidiEvent = function(e, inputDevice) {
	let command = e.data[0];
	let note = e.data[1];
	let velocity = (e.data.length > 2) ? e.data[2] : 0;

	if(command >= 0x90 && command <= 0x9F) {
		let channel = command & 0xF;
		playedNotesInput.noteOn(note, velocity, e.timeStamp);
	}
	else if(command >= 0x80 && command <= 0x8F) {
		let channel = command & 0xF;
		playedNotesInput.noteOff(note, e.timeStamp);
	}
}

let midiCanvas = new MidiRollCanvas(document.querySelector("#midi-canvas"))

let millisPerBeat = 1000 * 60 / 120;
let whole     = millisPerBeat*4;
let quarter   = millisPerBeat;
let eigth     = millisPerBeat/2;
let sixteenth = millisPerBeat/4;

function redraw() {
	if(playedNotes.notes.length == 0) return;

	const timeWindow = 3*whole;

	const canvasTime = window.performance.now();
	midiCanvas.minTime = canvasTime - timeWindow / 2;
	midiCanvas.maxTime = canvasTime + timeWindow / 2;

	let hi = 0;
	let lo = 1e7;
	for(const note of playedNotes.notes) {
		if(note.value > hi) hi = note.value;
		if(note.value < lo) lo = note.value;
	}
	midiCanvas.minNote = lo;
	midiCanvas.maxNote = hi + 1;

	// midiCanvas.time += (bpm/60)/fps;
	midiCanvas.beginFrame();

	// midiCanvas.drawMeasure(0, 12, 4);
	for(const note of playedNotes.notes) {
		let end = (midiCanvas.minTime + midiCanvas.maxTime) / 2;
		if(note.end) {
			end = note.end;
		}

		if(end < midiCanvas.minTime) continue;
		let start    = note.start;
		let duration = Math.max(note.end? sixteenth:0, end - start);
		midiCanvas.drawNote(note.value, start, duration);
	}

	midiCanvas.endFrame();
}
setInterval(redraw);

console.log("register file listener")
MidiParser.parse(document.querySelector("#midi-file-input"), function(obj) {
	console.log(obj);
});
