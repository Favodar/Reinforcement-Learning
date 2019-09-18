var canvas = document.querySelector('canvas');
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

var attempts = 3;
var successes = 0;

canvas.width = innerWidth;
canvas.height = innerHeight;

var ctx = canvas.getContext('2d');

function Circle() {
    this.radius = 30;
    this.x = Math.random() * (innerWidth - this.radius * 2) + this.radius;
    this.y = Math.random() * (innerHeight - this.radius * 2) + this.radius;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'grey';
        ctx.fill();
    }

    this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

function Square() {
    this.width = 60;
    this.height = 60;
    this.x = Math.random() * (innerWidth - this.width);
    this.y = Math.random() * (innerHeight - this.height);
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;

    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'grey';
        ctx.fill();
    }

    this.update = function () {
        if (this.x + this.width > innerWidth || this.x < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.height > innerHeight || this.y < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

var circle = new Circle();
var square = new Square();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    circle.draw();
    square.draw();

    circle.update();
    square.update();
}

animate();