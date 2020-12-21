class Synth {
	constructor() {
		this.env = new p5.Env();
		this.osc = new p5.Oscillator("triangle");
		this.osc.amp(this.env);
		this.osc.start();
	}

	setADSR(attack, decay) {
		this.env.setADSR(attack, decay);
	}

	playNote(pitch, time) {
		this.setADSR(0.05, time);
		this.osc.freq(midiToFreq(pitch));
		this.env.mult(0.5);
		this.env.ramp(this.osc, 0, 1, 0);
	}
}