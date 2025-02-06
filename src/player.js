class Player {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = width / 10;
        this.onPlatform = false;
        this.color = config.playerColor;
        this.speed = createVector(4, 4);
        this.jumpPower = createVector(0, 5);
        this.gravity = createVector(0, 2);
    }

    show() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.size * config.gameSize);
    }

    move() {
        if (keyIsDown(65)) this.x -= this.speed.x; // A
        if (keyIsDown(68)) this.x += this.speed.x; // D
        if (keyIsDown(87)) this.y -= this.jumpPower.y; // W
        if (keyIsDown(83)) this.y += this.speed.y; // S
    }
}
