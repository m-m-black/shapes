let shapes;
let shapeOpen;
let currentNode;
let currentShape;

const DIST_THRESH = 20;
const C_MAJOR = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72];

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
	if (currentShape && currentShape.nodes.length > 0 && currentShape.pending) {
		let n = currentShape.nodes.length;
		line(currentShape.nodes[n-1].x, currentShape.nodes[n-1].y, currentNode.x, currentNode.y);
		ellipse(currentNode.x, currentNode.y, 10, 10);
	}
}

function mousePressed() {
	let node = new Node(mouseX, mouseY);
	currentNode = node;
	if (!shapeOpen) {
		let shape = new Shape();
		currentShape = shape;
	}
	currentShape.pending = true;
	return false; // Prevent default behaviour of mousePressed()
}

function mouseDragged() {
	currentNode.x = mouseX;
	currentNode.y = mouseY;
	checkPosition();
	return false; // Prevent default behavuour of mouseDragged()
}

function mouseReleased() {
	checkPosition();
	if (currentNode.isAllowed) {
		currentShape.add(currentNode);
		if (!shapeOpen) {
			currentShape.init();
			shapes.push(currentShape);
			shapeOpen = true;

		}
	} else if (currentNode.isOrigin) {
		currentShape.close();
		shapeOpen = false;
	}
	currentShape.pending = false;
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

// Take raw frequency as input, return that frequency quantised to a scale degree
function quantise(f) {
	let freq = null;
	for (let i = 0; i < C_MAJOR.length; i++) {
		if (f < midiToFreq(C_MAJOR[i])) {
			freq = midiToFreq(C_MAJOR[i]);
			break;
		}
	}
	return freq;
}
