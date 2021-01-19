let shapes;
let shapeOpen;
let currentNode;
let currentShape;
let sessionStarted;
let grid;
let pitchAxis;

const DIST_THRESH = 20;
const SPEED = 4;
const SCALE = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72];

function setup() {
	createCanvas(windowWidth, windowHeight);
	shapes = [];
	grid = initGrid();
	shapeOpen = false;
	sessionStarted = false;
	pitchAxis = windowWidth > windowHeight ? windowWidth : windowHeight;
}

function draw() {
	background(0);
	noFill();
	stroke(200);
	if (sessionStarted) {
		strokeWeight(1);
		drawGrid();
		strokeWeight(2);
		drawShapes();
	} else {
		drawText();
	}
}

function drawGrid() {
	grid.forEach(i => {
		if (i > 0) {
			stroke(25);
			if (windowWidth > windowHeight) {
				line(i, 0, i, height);
			} else {
				line(0, i, width, i);
			}
		}
	})
}

function drawShapes() {
	shapes.forEach(shape => {
		shape.display();
	})
	if (currentShape && currentShape.nodes.length > 0 && currentShape.pending) {
		let n = currentShape.nodes.length;
		stroke(255, 0, 0);
		line(currentShape.nodes[n-1].x, currentShape.nodes[n-1].y, currentNode.x, currentNode.y);
		stroke(200);
		ellipse(currentNode.x, currentNode.y, 10, 10);
	}
}

function drawText() {
	noStroke();
	fill(200);
	textSize(width / 50);
	textAlign(CENTER, CENTER);
	textFont("Comfortaa");
	let instructions1 = "HOW TO PLAY:\n"
			+ "1. Turn your sound on\n"
			+ "2. Click to draw a node\n"
			+ "3. Draw multiple nodes to form a shape\n"
			+ "4. Click back on the first node to form a closed loop\n";
	let instructions2 = "A shape must form a loop before a new shape can be made\n"
			+ "(click and drag towards the first node of a shape and it will lock in place)";
	text(instructions1, width / 2, height * (1 / 3));
	text(instructions2, width / 2, height / 2);
	text("Click anywhere to start...", width / 2, height * (2 / 3));
}

function mousePressed() {
	if (sessionStarted) {
		let node = new Node(mouseX, mouseY);
		currentNode = node;
		if (!shapeOpen) {
			let shape = new Shape();
			currentShape = shape;
		}
		currentShape.pending = true;
	} else {
		sessionStarted = true;
	}
	return false; // Prevent default behaviour of mousePressed()
}

function mouseDragged() {
	if (sessionStarted && currentNode) {
		currentNode.x = mouseX;
		currentNode.y = mouseY;
		checkPosition();
	}
	return false; // Prevent default behaviour of mouseDragged()
}

function mouseReleased() {
	if (sessionStarted && currentShape) {
		checkPosition();
		if (currentNode.isAllowed) {
			currentNode.init(pitchAxis);
			currentShape.add(currentNode);
			if (!shapeOpen) {
				currentShape.init(SPEED);
				shapes.push(currentShape);
				shapeOpen = true;
			}
		} else if (currentNode.isOrigin) {
			currentShape.close();
			shapeOpen = false;
		}
		currentShape.pending = false;
	}
	return false; // Prevent default behaviour of mouseReleased()
}

function checkPosition() {
	for (let i = 0; i < currentShape.nodes.length; i++) {
		if (currentNode.within(currentShape.nodes[i], DIST_THRESH)) {
			currentNode.x = currentShape.nodes[i].x;
			currentNode.y = currentShape.nodes[i].y;
			currentNode.isAllowed = false;
			if (i == 0) {
				currentNode.isOrigin = true;
			}
			break;
		} else {
			currentNode.isAllowed = true;
			currentNode.isOrigin = false;
		}
	}
}

function initGrid() {
	let array = [];
	let axis = windowWidth > windowHeight ? windowWidth : windowHeight;
	let stepSize = axis / SCALE.length;
	for (let i = 0; i < axis; i += stepSize) {
		array.push(i);
	}
	return array;
}
