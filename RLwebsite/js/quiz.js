var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

// Variables and Constants

var attempts = 3;
var successes = 0;

var colors = [
    '#00bdff',
    '#4d39ce',
    '#088eff'
];

var successColors = [
    '#009933',
    '#00e64d',
    '#b3ffcc'
];

var errorColors = [
    '#cc0000',
    '#ff5050',
    '#ffb3b3'
];

var mouse = {
    x: undefined,
    y: undefined
};

// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
function Bubble(radius, color) {
    this.radius = radius;
    this.color = color;
    this.x = 0;
    this.y = -radius;
    this.dy = 0;

    this.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * canvas.height;
        this.dy = (Math.random() * 3) + 5;
    }

    this.update = function () {
        if (this.y > -radius) {
            this.y -= this.dy;
        }
    }

    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function BubbleWall(colors) {
    this.bubbles = [];
    for (var i = 0; i < 300; i++) {
        this.bubbles.push(new Bubble(randomIntFromRange(20, 50), randomColor(colors)));
    }

    this.reset = function () {
        for (var i = 0; i < this.bubbles.length; i++) {
            this.bubbles[i].reset();
        }
    }

    this.update = function () {
        for (var i = 0; i < this.bubbles.length; i++) {
            this.bubbles[i].update();
        }
    }

    this.draw = function () {
        for (var i = 0; i < this.bubbles.length; i++) {
            this.bubbles[i].draw();
        }
    }
}

function Counter() {
    this.startTime = -1;
    this.counter = -1;

    this.reset = function () {
        this.startTime = Date.now();
        this.counter = 3;
    }

    this.update = function () {
        if (Date.now() > this.startTime + 1000) {
            this.startTime = Date.now();
            this.counter--;
        }
    }

    this.draw = function () {
        if (this.counter < 0) {
            return;
        }

        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + (Date.now() - this.startTime) + 'px Courier';
        ctx.fillStyle = '#333';

        if (this.counter > 0) {
            ctx.fillText(this.counter, canvas.width / 2, canvas.height / 2);
        }
        else {
            ctx.fillText('GO', canvas.width / 2, canvas.height / 2);
        }
        ctx.closePath();

        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + (Date.now() - this.startTime) + 'px Courier';
        ctx.strokeStyle = '#fff';

        if (this.counter > 0) {
            ctx.strokeText(this.counter, canvas.width / 2, canvas.height / 2);
        }
        else {
            ctx.strokeText('GO', canvas.width / 2, canvas.height / 2);
        }
        ctx.closePath();
    }
}

function Circle(radius) {
    this.radius = radius;
    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
    this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.circleParticles = [];
    for (var i = 0; i < 60; i++) {
        this.circleParticles.push(
            new CircleParticle(
                this,
                (Math.random() * 2) + 1,
                randomColor(colors)
            )
        );
    }

    this.organize = function () {
        for (var i = 0; i < this.circleParticles.length; i++) {
            this.circleParticles[i].shouldOrganize = true;
        }
    }

    this.draw = function () {
        for (var i = 0; i < this.circleParticles.length; i++) {
            this.circleParticles[i].draw();
        }
    }

    this.update = function () {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        for (var i = 0; i < this.circleParticles.length; i++) {
            this.circleParticles[i].update();
        }
    }
}

function CircleParticle(circle, radius, color) {
    this.circle = circle;
    this.x = circle.x;
    this.y = circle.y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = randomIntFromRange(4, 6) * 0.01;
    this.distanceFromCenter = randomIntFromRange(circle.radius / 2, circle.radius);
    this.unorganizedDistanceFromCenter = {
        x: randomIntFromRange(circle.radius, canvas.width / 2),
        y: randomIntFromRange(circle.radius, canvas.width / 2)
    };
    this.lastPoint = { x: this.x, y: this.y };
    this.organized = false;
    this.shouldOrganize = false;

    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    }

    this.update = function () {
        this.lastPoint = { x: this.x, y: this.y };

        if (this.organized) {
            this.radians += this.velocity;
            this.x = this.circle.x + Math.cos(this.radians) * this.distanceFromCenter;
            this.y = this.circle.y + Math.sin(this.radians) * this.distanceFromCenter;
        }
        else {
            this.radians += this.velocity;
            this.x = this.circle.x + Math.cos(this.radians) * this.unorganizedDistanceFromCenter.x;
            this.y = this.circle.y + Math.sin(this.radians) * this.unorganizedDistanceFromCenter.y;
        }

        if (this.shouldOrganize) {
            if (this.unorganizedDistanceFromCenter.x < this.unorganizedDistanceFromCenter.y) {
                this.unorganizedDistanceFromCenter.y -= 4;
            }
            else {
                this.unorganizedDistanceFromCenter.x -= 4;
            }

            if (
                this.unorganizedDistanceFromCenter.x <= this.distanceFromCenter
                || this.unorganizedDistanceFromCenter.y <= this.distanceFromCenter
            ) {
                this.organized = true;
            }
        }
    }
}

function Square(width, height) {
    this.width = width;
    this.height = height;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.squareParticles = [];
    for (var i = 0; i < 100; i++) {
        this.squareParticles.push(
            new SquareParticle(
                this,
                (Math.random() * 2) + 1,
                randomColor(colors)
            )
        );
    }

    this.organize = function () {
        for (var i = 0; i < this.squareParticles.length; i++) {
            this.squareParticles[i].shouldOrganize = true;
        }
    }

    this.draw = function () {
        for (var i = 0; i < this.squareParticles.length; i++) {
            this.squareParticles[i].draw();
        }
    }

    this.update = function () {
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.height > canvas.height || this.y < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        for (var i = 0; i < this.squareParticles.length; i++) {
            this.squareParticles[i].update();
        }
    }
}

function SquareParticle(square, radius, color) {
    this.square = square;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) + 2;
    this.dy = (Math.random() - 0.5) + 2;
    this.lastPoint = { x: this.x, y: this.y };
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = randomIntFromRange(4, 6) * 0.01;
    this.distanceFromCenter = randomIntFromRange(circle.radius / 2, circle.radius);
    this.unorganizedDistanceFromCenter = {
        x: randomIntFromRange(circle.radius, canvas.width / 2),
        y: randomIntFromRange(circle.radius, canvas.width / 2)
    };
    this.organized = false;
    this.shouldOrganize = false;

    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    }

    this.update = function () {
        this.lastPoint = { x: this.x, y: this.y };

        if (this.organized) {
            if (this.x > this.square.x + this.square.width) {
                this.x = this.square.x + this.square.width;
                this.dx = -this.dx;
            }
            if (this.x < this.square.x) {
                this.x = this.square.x;
                this.dx = -this.dx;
            }
            if (this.y > this.square.y + this.square.height) {
                this.y = this.square.y + this.square.height;
                this.dy = -this.dy;
            }
            if (this.y < this.square.y) {
                this.y = this.square.y;
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;
        }
        else {
            this.radians += this.velocity;
            this.x = this.square.x + Math.cos(this.radians) * this.unorganizedDistanceFromCenter.x;
            this.y = this.square.y + Math.sin(this.radians) * this.unorganizedDistanceFromCenter.y;
        }

        if (this.shouldOrganize) {
            this.unorganizedDistanceFromCenter.x--;
            this.unorganizedDistanceFromCenter.y--;

            if (
                this.x < square.x + square.width
                && this.x > square.x
                && this.y < square.y + square.height
                && this.y > square.y
            ) {
                this.organized = true;
            }
        }
    }
}

// Implementation
var circle = new Circle(100);
var square = new Square(150, 150);
var counter = new Counter();
var errorBubbleWall = new BubbleWall(errorColors);
var successBubbleWall = new BubbleWall(successColors);

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    errorBubbleWall.update();
    errorBubbleWall.draw();

    successBubbleWall.update();
    successBubbleWall.draw();

    circle.update();
    circle.draw();

    square.update();
    square.draw();

    counter.update();
    counter.draw();
}

animate();
successBubbleWall.reset();

setTimeout(function () {
    errorBubbleWall.reset();
}, 1000);

setTimeout(function () {
    counter.reset();
}, 2000);

setTimeout(function () {
    circle.organize();
    square.organize();
}, 4000);