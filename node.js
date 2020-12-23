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
		this.midi = null;
	}

	init() {
		this.vector = createVector(this.x, this.y);
		this.pitchAxis = windowWidth > windowHeight ? windowWidth : windowHeight;
		this.pitchAxisValue = windowWidth > windowHeight ? this.x : this.y;
		for (let i = grid.length; i >= 0; i--) {
			if (this.pitchAxisValue > grid[i]) {
				if (this.pitchAxis === windowHeight) {
					this.midi = SCALE[(SCALE.length - 1) - i];
				} else {
					this.midi = SCALE[i];
				}
				break;
			}
		}
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