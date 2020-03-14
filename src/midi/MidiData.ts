import { MidiParser } from 'midi-parser-js'
import MidiStream from './MidiStream';

interface MidiNote {
	start: number;
	end: number|undefined;
	velocity: number;
	value: number;
}

export
class MidiDataStream implements MidiStream {
	data: MidiData;
	openNotes: Map<number, MidiNote>;

	constructor(data?: MidiData) {
		this.data = data??new MidiData();
		this.openNotes = new Map();
	}

	noteOn(note: number, velocity: number, time: number): void {
		let event: MidiNote = {
			start: time,
			end: undefined,
			value: note,
			velocity: velocity,
		};
		this.data.notes.push(event);
		this.openNotes.set(note, event);
	}

	noteOff(note: number, time: number): void {
		let e = this.openNotes.get(note);
		if(e) {
			e.end = time;
			this.openNotes.delete(note);
		}
	}
}

export default
class MidiData {
	notes: MidiNote[];

	constructor() {
		this.notes = [];
	}

	inputStream(): MidiDataStream { return new MidiDataStream(this); }
}
