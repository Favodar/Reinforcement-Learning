const circleDiameter = 200;
const squareDiameter = 200;
const tries = 3;
const numParticles = 50;

var circleX;
var circleY;
var squareX;
var squareY;

var clickTime;
var currentTime;
var currentTry;
var reward;
var penalty;

var particles;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(66, 66, 200);

    randomPos();
    currentTry = 0;
    reward = false;
    penalty = false;

    particles = [];
    for (var i = 0; i < numParticles; i++) {
        particles.push(new Particle(-50, -50));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//'game' loop
function draw() {
    currentTime = millis();
    if (currentTry < tries) {
        if (reward) {
            if (currentTime - clickTime > 1000) {
                randomPos();
                currentTry++;
                reward = false;
            }
            background(66, 200, 66);
        }
        else if (penalty) {
            if (currentTime - clickTime > 1000) {
                randomPos();
                penalty = false;
            }
            background(200, 66, 66);
        }
        else {
            background(66, 66, 200);
        }
        rect(squareX, squareY, squareDiameter, squareDiameter);
        ellipse(circleX, circleY, circleDiameter, circleDiameter);
        for (var i = 0; i < numParticles; i++) {
            particles[i].x += particles[i].dx;
            particles[i].y += particles[i].dy;
            noStroke();
            fill(particles[i].color);
            ellipse(particles[i].x, particles[i].y, 5, 5);
        }
        stroke(0, 0, 0, 255);
        fill(255, 255, 255);
    }
    else {
        background(200, 200, 200);
        //resizeCanvas(0, 0);
        //setActiveStyleSheet("parallax")
        //window.location.replace("parallax.html");
        window.location.assign("parallax.html");
        
    }
}

function mousePressed() {
    clickTime = millis();
    if (mouseOverSquare()) {
        penalty = true;
    }
    else if (mouseOverCircle()) {
        for (var i = 0; i < numParticles; i++) {
            particles[i].x = mouseX;
            particles[i].y = mouseY;
        }
        reward = true;
    }
}

function randomPos() {
    circleX = random(windowWidth - circleDiameter);
    circleY = random(windowHeight - circleDiameter);
    squareX = random(windowWidth - squareDiameter);
    squareY = random(windowHeight - squareDiameter);
}

function mouseOverSquare() {
    return mouseX > squareX
        && mouseX < squareX + squareDiameter
        && mouseY > squareY
        && mouseY < squareY + squareDiameter;
}

function mouseOverCircle() {
    return mouseX > circleX - circleDiameter / 2
        && mouseX < circleX + circleDiameter / 2
        && mouseY > circleY - circleDiameter / 2
        && mouseY < circleY + circleDiameter / 2;
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let radians = random(3.14159 * 2);
        let speed = random(1, 10);
        this.dx = Math.cos(radians) * speed;
        this.dy = Math.sin(radians) * speed;
        this.color = color(random(255), random(255), random(255), 255);
    }
}

/**function setActiveStyleSheet(title) {
   var i, a, main;
   for(i=0; (a = document.getElementsByTagName("link")<i>); i++) {
     if(a.getAttribute("rel").indexOf("style") != -1
        && a.getAttribute("title")) {
       a.disabled = true;
       if(a.getAttribute("title") == title) a.disabled = false;
     }
   }
}**/