import { read as ReadMidiFile, StreamSource, ChannelEvent, NoteOnEvent } from 'midifile-ts'

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
	private openNotes: Map<number, MidiNote>;

	constructor(data?: MidiData) {
		this.data = data??new MidiData();
		this.openNotes = new Map();
	}

	setBpm(bpm: number, time?: number): MidiDataStream {
		return this;
	}

	setTimeSignature(denom: number, enumr: number, time?: number): MidiDataStream {
		return this;
	}

	noteOn(note: number, velocity: number, time: number): void {
		// velocity = 0 is commonly used as "note off"
		if(velocity == 0) {
			return this.noteOff(note, time);
		}

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
			// console.log("Note length: " + (e.end - e.start))
			this.openNotes.delete(note);
		}
	}
}

export default
class MidiData {
	name?: string;
	notes: MidiNote[];
	clock: MidiClock[];

	constructor() {
		this.notes = [];
	}

	inputStream(): MidiDataStream { return new MidiDataStream(this); }

	static ReadFile(from: StreamSource | Element, callback: (result: MidiData[]) => any): MidiData[] {
		if(from instanceof Element) {
			let element = from as HTMLInputElement;
			let reader = new FileReader();
			reader.onload = e => MidiData.ReadFile(e.target.result as ArrayBuffer, callback);
			reader.readAsArrayBuffer(element.files[0]);
			return;
		}
	
		let tracks = [] as MidiData[];

		let existingTrackNames = {}
	
		const midi = ReadMidiFile(from);
		for(const midiTrack of midi.tracks) {
			let track = new MidiData();

			let stream = new MidiDataStream(track);

			let millisPerTick = (60000 / 120) / midi.header.ticksPerBeat;
			let time = 0;
			for(const event of midiTrack) {
				time += event.deltaTime * millisPerTick;
				switch(event.type) {
					case "channel":
						switch(event.subtype) {
							case "channelAftertouch": break;
							case "controller": break;
							case "noteAftertouch": break;
							case "noteOff": stream.noteOff(event.noteNumber, time); break;
							case "noteOn": stream.noteOn(event.noteNumber, event.velocity, time); break;
							case "pitchBend": break;
							case "programChange": break;
							case "unknown": break;
						}
					break;
					case "meta":
						switch(event.subtype) {
							case "setTempo":
								stream.setBpm(60000000 / event.microsecondsPerBeat, time);
								millisPerTick = event.microsecondsPerBeat * 1000 / midi.header.ticksPerBeat;
								break;
							case "timeSignature": stream.setTimeSignature(event.denominator, event.numerator, time); break;
							case "trackName":
								if(existingTrackNames[event.text]) {
									track.name = `${event.text} (${existingTrackNames[event.text]})`;
									existingTrackNames[event.text] += 1;
								}
								else {
									existingTrackNames[event.text] = 1;
									track.name = event.text;
								}
								break;
							case "instrumentName": if(!track.name) track.name = event.text; break;
						}
					break;
					case "sysEx": case "dividedSysEx": break;
				}
			}

			if(!track.name) track.name = `Track ${tracks.length + 1}`

			tracks.push(track);
		}
	
		if(callback) {
			callback(tracks);
		}

		console.log(tracks)
	
		return tracks;
	}
}
