export default function MapSketch(p) {
	let width = 0;
	let height = 0;

	let dragging = false;
	let dragStart = {x: 0, y: 0}
	let origin = {x: 0, y: 0}

	let zoom = 2;

	let linked = [];
	let a = [];
	let b = [];

	const isNear = (elt, mouseX, mouseY) => 1 > (elt.x-mouseX-.5)**2 + (elt.y-mouseY-.5)**2;
	
	p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
		if (props.size) {
			width = props.size.width;
			height = props.size.height;
			// origin translate based on zoom
			p.resizeCanvas(width-6, height-6);
			origin = {x: p.width/2, y: p.height/2}
		}
		if (props.data) {
			linked = props.data.linked;
			a = props.data.a;
			b = props.data.b;
		}
	};

	p.setup = () => {
		p.createCanvas(width, height)
	}

	p.mousePressed = () => {
		dragging = true;
		dragStart = {x: p.mouseX, y: p.mouseY};
	}

	p.mouseReleased = () => {
		dragging = false;
		origin = {x: origin.x + p.mouseX - dragStart.x, y: origin.y + p.mouseY - dragStart.y};
	}

	p.mouseWheel = (e) =>  {
		if (e.delta < 0) {
			zoom = p.constrain(zoom+1, 1, 12);
		} else {
			zoom = p.constrain(zoom-1, 1, 12);
		}
		return false;
	}
	
	p.draw = () => {
		p.background("#8bc34a");
		p.cursor('grab');

		const mouseWorldX = p.constrain(Math.floor((p.mouseX - origin.x - (dragging ? p.mouseX - dragStart.x : 0))/zoom +500), 0, 999);
		const mouseWorldY = p.constrain(Math.floor((p.mouseY - origin.y - (dragging ? p.mouseY - dragStart.y : 0))/zoom +500), 0, 999);
		
		p.push();

		p.translate(origin.x, origin.y);
		if (dragging) {
			p.cursor('grabbing');
			p.translate(p.mouseX - dragStart.x, p.mouseY - dragStart.y);
		}
		p.scale(zoom,zoom);

		// lines
		p.stroke('#3F3F3F');
		for (let i = -500; i < 600; i+=100) {
			p.line(i, -500, i, 500);
		}
		for (let j = -500; j < 600; j+=100) {
			p.line(-500, j, 500, j);
		}

		p.rectMode(p.CENTER);

		// render data
		p.noStroke();
		p.fill('#21449E'); // a
		for (let elt of a) {
			p.rect(elt.x-500, elt.y-500, 1, 1);
			if (isNear(elt, mouseWorldX, mouseWorldY)) p.cursor('pointer');
		}
		p.fill('#D21A07'); // b
		for (let elt of b) {
			p.rect(elt.x-500, elt.y-500, 1, 1);
			if (isNear(elt, mouseWorldX, mouseWorldY)) p.cursor('pointer');
		}
		// linked
		for (let elt of linked) {
			if (!elt.found) continue;
			if (isNear(elt, mouseWorldX, mouseWorldY)) p.cursor('pointer');
			if (isNear(elt.found, mouseWorldX, mouseWorldY)) p.cursor('pointer');
			p.strokeWeight(0.5);
			p.stroke(255);
			p.line(elt.x-500, elt.y-500, elt.found.x-500, elt.found.y-500);
			p.noStroke();
			p.fill('#21449E');
			p.rect(elt.x-500, elt.y-500, 1, 1);
			p.fill('#D21A07');
			p.rect(elt.found.x-500, elt.found.y-500, 1, 1);
		}

		p.pop();

		// GUI
		p.noStroke();
		p.fill("#8bc34a");
		p.rect(0,0,80,65);
		p.fill('#3F3F3F');
		p.text(`${mouseWorldX}|${mouseWorldY}`, 20, 15);
		p.text(`K${Math.floor(mouseWorldX/100)}${Math.floor(mouseWorldY/100)}`, 20, 35);
		p.text(`${zoom*100}%`, 20, 55);
	}
}