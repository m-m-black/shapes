let shapes;
let shapeOpen;
let currentNode;
let currentShape;

const DIST_THRESH = 20;

function setup() {
	createCanvas(windowWidth, windowHeight);
	shapes = [];
	shapeOpen = false;
}

function draw() {
	background(0);
	noFill();
	stroke(200);
	shapes.forEach(shape => {
		shape.display();
	})
}

function mousePressed() {
	if (currentShape) {
		currentShape.pending = true;
	}
	if (shapeOpen) {
		// Append node to current shape
		let node = new Node(mouseX, mouseY);
		currentNode = node;
		currentShape.add(currentNode);
	} else {
		// Create new shape with new node
		let node = new Node(mouseX, mouseY);
		currentNode = node;
		let shape = new Shape();
		currentShape = shape;
		currentShape.add(currentNode);
		currentShape.spot = currentNode;
		shapes.push(currentShape);
		shapeOpen = true;
	}
	return false; // Prevent default behaviour of mousePressed()
}

function mouseDragged() {
	currentNode.x = mouseX;
	currentNode.y = mouseY;
	// Check for proximity to other nodes
	for (let i = 0; i < currentShape.nodes.length - 1; i++) {
		if (currentNode.within(currentShape.nodes[i], DIST_THRESH)) {
			currentNode.x = currentShape.nodes[i].x;
			currentNode.y = currentShape.nodes[i].y;
			currentNode.diameter = 20;
			break;
		} else {
			currentNode.diameter = 10;
		}
	}
	return false; // Prevent default behavuour of mouseDragged()
}

function mouseReleased() {
	currentNode.diameter = 10;
	// Check for proximity to other nodes
	for (let i = 0; i < currentShape.nodes.length - 1; i++) {
		if (currentNode.within(currentShape.nodes[i], DIST_THRESH)) {
			if (i == 0) {
				// User clicked on first node in shape, so we close this shape
				currentShape.close();
				shapeOpen = false;
			}
			currentShape.nodes.pop();
			break;
		}
	}
	currentShape.pending = false;
	return false; // Prevent default behaviour of mouseReleased()
}

class Node {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.diameter = 10;
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

class Shape {
	constructor(node) {
		this.nodes = [];
		this.closed = false;
		this.pending = false; // Is there a node waiting to be drawn?
		// If so, play melody from node 0 to node length-2
		// Otherwise, play melody from node 0 to node length-1
		this.spot = null;
	}

	add(node) {
		this.nodes.push(node);
	}

	display() {
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

	close() {
		this.closed = true;
	}
}
