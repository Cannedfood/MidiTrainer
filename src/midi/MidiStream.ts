export default
interface MidiStream {
	noteOn(note:number, velocity:number, time:number):void;
	noteOff(note:number, time:number):void;
}
