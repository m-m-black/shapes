class Node {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.diameter = 10;
		this.isAllowed = true;
		this.isOrigin = false;
		// The following fields to be initialised in init()
		this.vector = null;
		this.pitchAxis = null;
		this.pitchAxisValue = null;
		this.rawFreq = null;
		this.freq = null;
	}

	init() {
		this.vector = createVector(this.x, this.y);
		this.pitchAxis = windowWidth > windowHeight ? windowWidth : windowHeight;
		this.pitchAxisValue = windowWidth > windowHeight ? this.x : this.y;
		this.rawFreq = map(this.pitchAxisValue, 0, this.pitchAxis, 120, 530);
		if (this.pitchAxis === windowHeight) {
			this.rawFreq = abs(windowHeight - this.rawFreq);
		}
		this.freq = quantise(this.rawFreq);
	}

	display() {
		ellipse(this.x, this.y, this.diameter, this.diameter);
	}

	// Calculate if this node is within n distance of another node
	within(node, n) {
		let within = false;
		if (dist(this.x, this.y, node.x, node.y) < n) {
			within = true;
		}
		return within;
	}
}