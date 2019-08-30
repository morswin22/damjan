const canvasParent = document.querySelector('#map');
const zoomNode = document.querySelector('#map input');

let mapImage;
let loaded = false;

let ctx;

// For future map generator link
// save=0
// &zoom=300
// &x=500
// &y=500
// &fill=000000
// &nobx=0
// &noby=0
// &tribe[][id]=fear?
// &tribe[][colour]=0000ff
// &village[][x]=545
// &village[][y]=499
// &village[][colour]=ff00ff
// &village[][x]=583
// &village[][y]=476
// &player[][colour]=000000 // this is strange (it might be last village color)

function setup() {
    let canvas = createCanvas(canvasParent.clientWidth,canvasParent.clientHeight);
    ctx = canvas.drawingContext;
    canvas.parent(canvasParent);
}

function draw() { 
    background(82,117,40);
    noCursor();
    const isZooming = !(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
    let zoomW, zoomH, size;
    if (isZooming) {
        zoomW = map(zoomNode.value, 0, 2, width/1000, width/1000*8);
        zoomH = map(zoomNode.value, 0, 2, height/1000, width/1000*8);
        size = map(zoomNode.value, 0, 2, 3, 9);
    }

    stroke(60);
    if (!isZooming) {
        for (let i = 100; i < 1000; i+=100) {
            line(i*width/1000,0,i*width/1000,height);
            line(0,i*height/1000,width,i*height/1000);
        }
    } else {
        for (let i = 100; i < 1000; i+=100) {
            line(((i*width/1000 - mouseX)/width*1000)*zoomW,0,((i*width/1000 - mouseX)/width*1000)*zoomW,height);
            line(0,((i*height/1000 - mouseY)/height*1000)*zoomH,width,((i*height/1000 - mouseY)/height*1000)*zoomH);
        }
    }
    noStroke();
    

    if (isZooming) {
        for (let elt of results[selectedOutput+'NotUsedB']) {
            fill(255,90,0);
            const x1 = ((elt.x*width/1000 - mouseX)/width*1000)*zoomW;
            const y1 = ((elt.y*height/1000 - mouseY)/height*1000)*zoomH
            ellipse(x1,y1,size);
        }
        for (let elt of results[selectedOutput+'Raw']) {
            const x1 = ((elt.x*width/1000 - mouseX)/width*1000)*zoomW;
            const y1 = ((elt.y*height/1000 - mouseY)/height*1000)*zoomH
            fill(0,0,255);
            if (!elt.found) fill(0,90,255);
            ellipse(x1,y1,size);
            if (elt.found) {
                fill(255,0,0);
                const x2 = ((elt.found.x*width/1000 - mouseX)/width*1000)*zoomW;
                const y2 = ((elt.found.y*height/1000 - mouseY)/height*1000)*zoomH;
                ellipse(x2,y2,size);
                stroke(180);
                line(x1,y1,x2,y2);
                noStroke();
            }
        }
    } else {
        for(let type in data) {
            noStroke();
            if (type == 'targets') fill(255,0,0);
            if (type == 'attackers') fill(0,0,255);
            for (let element of data[type]) {
                ellipse(element.x*width/1000, element.y*height/1000, 3);
            }
        }
    }
    
    
}