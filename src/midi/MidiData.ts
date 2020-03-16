import { MidiParser } from 'midi-parser-js'

interface MidiNote {
	start: number;
	end: number|undefined;
	velocity: number;
	value: number;
}

interface MidiClock {
	time: number;
	beat: number;
	beatsPerBar: number;
	bpm: number;
}

export
class MidiDataStream {
	data: MidiData;
	openNotes: Map<number, MidiNote>;

	startTime: number;
	timeScale: number;

	constructor(data?: MidiData) {
		this.data = data??new MidiData();
		this.openNotes = new Map();
		this.timeScale = 1;
		this.startTime = 0;
	}

	setScale(startTime: number, timeScale: number): MidiDataStream {
		startTime = startTime;
		timeScale = timeScale;
		return this;
	}

	noteOn(note: number, velocity: number, time: number): void {
		// velocity = 0 is commonly used as "note off"
		if(velocity == 0) {
			return this.noteOff(note, time);
		}

		let event: MidiNote = {
			start: (time - this.startTime) / this.timeScale,
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
			e.end = (time - this.startTime) / this.timeScale;
			this.openNotes.delete(note);
		}
	}

	setBpm(bpm: number, time?: number): MidiDataStream {
		return this;
	}

	setTimeSignature(denom: number, enumr: number, time?: number): MidiDataStream {
		return this;
	}
}

export default
class MidiData {
	notes: MidiNote[];
	clock: MidiClock[];

	constructor() {
		this.notes = [];
	}

	inputStream(): MidiDataStream { return new MidiDataStream(this); }
}
