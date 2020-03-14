import MIDIFile from 'midifile'
import MIDIEvents from 'midievents'

import MidiRollCanvas from './display/MidiRollCanvas'
import MidiData from './midi/MidiData'
import Toasts from './web/Toasts'
import WebMidi from './web/WebMidi'

WebMidi.connect()

let playedNotes = new MidiData();
let playedNotesInput = playedNotes.inputStream();

WebMidi.onMidiEvent = function(e, inputDevice) {
	let command = e.data[0];
	let note = e.data[1];
	let velocity = (e.data.length > 2) ? e.data[2] : 0;

	let commandIsNoteOn = command >= 0x90 && command <= 0x9F;

	let noteOn = velocity>0&&commandIsNoteOn;
	let noteOff = (commandIsNoteOn&&velocity===0) || (command >= 0x80 && command <= 0x8F);

	if(noteOn || noteOff) {
		Toasts.add({
			type: "info",
			header: `${noteOn?"Note On" : "Note Off"}: ${inputDevice.name}`,
			message: `${note}, vel ${velocity}`,
			timeout: 500
		});
	}

	if(noteOn) {
		console.log(`${window.performance.now()} vs ${e.timeStamp}`);
		playedNotesInput.noteOn(note, velocity, e.timeStamp);
		redraw();
	}
	if(noteOff) {
		playedNotesInput.noteOff(note, e.timeStamp);
		redraw();
	}
}

let midiCanvas = new MidiRollCanvas(document.querySelector("#midi-canvas"))

let millisPerBeat = 1000 * 60 / 80;
let quarter = millisPerBeat;
let eigth = quarter/2;
let sixteenth = quarter/4;

function redraw() {
	if(playedNotes.notes.length == 0) return;

	const timeWindow = millisPerBeat*4*3;

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
		let end;
		if(note.end) end = note.end;
		else         end = (midiCanvas.minTime + midiCanvas.maxTime) / 2;

		if(end < midiCanvas.minTime) continue;
		let start    = note.start;
		let duration = Math.max(note.end? sixteenth:0, end - start);
		midiCanvas.drawNote(note.value, start, duration);
	}

	midiCanvas.endFrame();
}
setInterval(redraw);

console.log("register file listener")
let fileSlot = document.querySelector("#midi-file-input")
fileSlot.addEventListener('change', function(e) {
	console.log("file changed")
	let files = (e.target as any).files as FileList;

	console.log("start reading buffer")
	let reader = new FileReader();
	reader.onload = function(e) {
		console.log("read buffer")
		const data = e.target.result as ArrayBuffer;
		const midi = new MIDIFile(data);

		const numTracks = midi.header.getTracksCount()
		console.log(numTracks + " tracks found")

		let tracks = {}
		for (let index = 0; index < numTracks; index++) {
			console.log("Track " + index)
			const trackEvents = midi.getTrackEvents(index);
			let trackNotes = []
			let notes = {}

			let track = {
				notes: trackNotes
			}

			for(const e of trackEvents) {
				console.log(JSON.stringify(e))
				switch(e.type) {
					case 8:
						if(e.subtype == 8) {

						}
					default: continue;
				}
			}
		}
	};
	reader.readAsArrayBuffer(files.item(0));
})
