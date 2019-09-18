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

// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
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
    this.x = circle.x;
    this.y = circle.y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = randomIntFromRange(4, 6) * 0.01;
    this.distanceFromCenter = randomIntFromRange(circle.radius / 2, circle.radius);
    this.lastPoint = { x: this.x, y: this.y };

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

        this.radians += this.velocity;
        this.x = circle.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = circle.y + Math.sin(this.radians) * this.distanceFromCenter;
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
    this.x = (square.x + square.width) / 2;
    this.y = (square.y + square.height) / 2;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) + 2;
    this.dy = (Math.random() - 0.5) + 2;
    this.lastPoint = { x: this.x, y: this.y };

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

        if (this.x > square.x + square.width) {
            this.x = square.x + square.width;
            this.dx = -this.dx;
        }
        if (this.x < square.x) {
            this.x = square.x;
            this.dx = -this.dx;
        }
        if (this.y > square.y + square.height) {
            this.y = square.y + square.height;
            this.dy = -this.dy;
        }
        if (this.y < square.y) {
            this.y = square.y;
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

// Implementation
var circle = new Circle(100);
var square = new Square(150, 150);

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    circle.update();
    square.update();


    circle.draw();
    square.draw();
}

animate();