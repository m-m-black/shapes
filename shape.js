class Shape {
	constructor(node) {
		this.nodes = [];
		this.closed = false;
		this.pending = false; // Is there a node waiting to be drawn?
		// The following fields to be initialised in init()
		this.currentSpot = null;
		this.looping = null;
		this.mover = null; // The vector that will move around the shape
		this.velocity = null;
		this.target = null; // The vector that will be updated around the shape
		this.targetIndex = null; // Index of the target vector
		this.speed = null;
		this.up = null; // For back and forth motion, starting direction
		this.synth = null;
	}

	init() {
		this.currentSpot = 0;
		this.looping = false;
		this.mover = currentNode.vector.copy();
		this.target = currentNode.vector;
		this.targetIndex = 0;
		this.speed = 4;
		this.up = true;
		//this.synth = new SimpleSynth("triangle");
		this.synth = new Synth();
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
		if (p5.Vector.dist(this.mover, this.target) < this.speed / 2) {
			this.playNote();
			this.resetPosition();
			this.updateTarget();
			this.setVelocity();
		}
		this.mover.add(this.velocity);
		stroke(255, 0, 0);
		ellipse(this.mover.x, this.mover.y, 10, 10);
	}

	playNote() {
		let freq = this.nodes[this.targetIndex].freq;
		let dist = p5.Vector.dist(this.nodes[this.targetIndex].vector, this.nodes[this.nextIndex()].vector);
		let speed = frameRate() * this.speed;
		let time = dist / speed;
		this.synth.playNote(freqToMidi(freq), time * 0.99);
	}

	resetPosition() {
		this.mover.set(this.target.x, this.target.y);
	}

	updateTarget() {
		if (this.closed) {
			this.updateTargetLooping();
		} else {
			this.updateTargetBackAndForth();
		}
	}

	nextIndex() {
		let nextIndex = this.targetIndex;
		if (this.closed) {
			nextIndex = this.nextIndexLooping();
		} else {
			nextIndex = this.nextIndexBackAndForth();
		}
		return nextIndex;
	}

	nextIndexLooping() {
		let newIndex = this.targetIndex;
		if (this.targetIndex < this.nodes.length - 1) {
			newIndex++;
		} else {
			newIndex = 0;
		}
		return newIndex;
	}

	nextIndexBackAndForth() {
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

	setVelocity() {
		this.velocity = p5.Vector.sub(this.target, this.mover);
		this.velocity.normalize();
		this.velocity.mult(this.speed);
	}

	updateTargetLooping() {
		if (this.targetIndex < this.nodes.length - 1) {
			this.targetIndex++;
		} else {
			this.targetIndex = 0;
		}
		this.target = this.nodes[this.targetIndex].vector;
	}

	updateTargetBackAndForth() {
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