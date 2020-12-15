class Shape {
	constructor(node) {
		this.nodes = [];
		this.closed = false;
		this.pending = false; // Is there a node waiting to be drawn?
		// The following fields to be initialised in init()
		this.currentSpot = null;
		this.looping = null;
		this.mover = null; // The vector that will move around the shape
		this.target = null; // The vector that will be updated around the shape
		this.targetIndex = null; // Index of the target vector
		this.up = null; // For back and forth motion, starting direction
		this.synth = null;
	}

	init() {
		this.currentSpot = 0;
		this.looping = false;
		this.mover = currentNode.vector.copy();
		this.target = currentNode.vector;
		this.targetIndex = 0;
		this.up = true;
		this.synth = new p5.MonoSynth();
	}

	add(node) {
		this.nodes.push(node);
	}

	display() {
		this.displayNodes();
		if (this.nodes.length > 1) {
			this.displaySpot();
		}
	}

	displayNodes() {
		stroke(200);
		// Draw each node and lines between them
		if (this.nodes.length > 0) {
			let n = this.nodes;
			for (let i = 0; i < n.length; i++) {
				// Display the node
				n[i].display();
				// Draw lines between each node
				if (i < n.length - 1) {
					line(n[i].x, n[i].y, n[i+1].x, n[i+1].y);
				}
			}
			if (this.closed) {
				// Draw a line from the last node to the first node
				line(n[n.length-1].x, n[n.length-1].y, n[0].x, n[0].y);
			}
		}
	}

	displaySpot() {
		// Use n to determine how many nodes we traverse
		let n;
		if (this.pending) {
			n = this.nodes.length - 1;
		} else {
			n = this.nodes.length;
		}
		this.mover = p5.Vector.lerp(this.mover, this.target, 0.2);
		if (p5.Vector.dist(this.mover, this.target) < 1) {
			this.synth.play(this.nodes[this.targetIndex].freq, 0.1, 0, 1);
			if (this.closed) {
				this.updateTargetLooping();
			} else {
				this.updateTargetBackAndForth(n);
			}
		}
		stroke(255, 0, 0);
		ellipse(this.mover.x, this.mover.y, 15, 15);
	}

	nextTargetLooping() {
		let newIndex = this.targetIndex;
		if (this.targetIndex < this.nodes.length - 1) {
			newIndex++;
		} else {
			newIndex = 0;
		}
		return newIndex;
	}

	nextTargetBackAndForth() {
		let newIndex = this.targetIndex;
		if (this.up) {
			if (this.targetIndex < this.nodes.length - 1) {
				newIndex++;
			} else {
				newIndex--;
			}
		} else {
			if (this.targetIndex > 0) {
				newIndex--;
			} else {
				newIndex++;
			}
		}
		return newIndex;
	}

	updateTargetLooping() {
		if (this.targetIndex < this.nodes.length - 1) {
			this.targetIndex++;
		} else {
			this.targetIndex = 0;
		}
		this.target = this.nodes[this.targetIndex].vector;
	}

	updateTargetBackAndForth(n) {
		if (this.up) {
			if (this.targetIndex < this.nodes.length - 1) {
				this.targetIndex++;
			} else {
				this.targetIndex--;
				this.up = false;
			}
		} else {
			if (this.targetIndex > 0) {
				this.targetIndex--;
			} else {
				this.targetIndex++;
				this.up = true;
			}
		}
		this.target = this.nodes[this.targetIndex].vector;
	}

	close() {
		this.closed = true;
		this.looping = true;
	}
}