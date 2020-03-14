import Toasts from './Toasts'

import Vue from 'vue/dist/vue.common.dev'

export default
class WebMidi {
	private static model = new Vue({
		el: "#devices",
		data: {
			inputs: [],
			outputs: []
		}
	});

	static midiAccess: WebMidi.MIDIAccess;
	static onMidiEvent: (e: WebMidi.MIDIMessageEvent, input: WebMidi.MIDIInput)=>void;

	static async connect(): Promise<boolean> {
		if(this.midiAccess) return true;

		if(!window.isSecureContext) {
			Toasts.add({
				type: "warning",
				header: "WebMidi warning",
				message:
					'Your browser does not consider this page as a '+
					'<a href="https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features">' +
					'	"secure origin"' +
					'</a>' +
					', we may not be able to use the WebMIDI API',
				timeout: 5000
			});
		}

		if(!navigator.requestMIDIAccess) {
			Toasts.add({
				type: "error",
				header: "WebMIDI error",
				message: 'Your browser does not support the <a href="https://caniuse.com/#feat=midi">WebMIDI API.</a>'
			});
			return false;
		}

		try { this.midiAccess = await navigator.requestMIDIAccess({ sysex: false }); }
		catch(e) {
			Toasts.add({
				type: "error",
				header: "Web MIDI error",
				message: e.message
			});
			return false;
		}

		return WebMidi.refreshDevices()
	}

	static refreshDevices(): boolean {
		this.midiAccess.inputs.forEach(input => {
			input.onmidimessage = function(e: WebMidi.MIDIMessageEvent) {
				if(this.onMidiEvent) { this.onMidiEvent(e, input); }
			}.bind(this);
		});
		WebMidi.model.inputs  = Array.from(this.midiAccess.inputs.values());
		WebMidi.model.outputs = Array.from(this.midiAccess.outputs.values());
		return true;
	}
}
