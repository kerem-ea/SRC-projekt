class Player {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = width / 20; 
        this.onPlatform = false;
        this.color = config.playerColor;
        this.speed = createVector(width * 0.02, width * 0.02); 
        this.jumpPower = createVector(0, width * 0.05); 
        this.gravity = createVector(0, width * 0.002); 
        this.velocity = createVector(0, 0); 
    }

    show() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.size * config.gameSize); 
    }

    move() {
        if (keyIsDown(65)) this.x -= this.speed.x; // A 
        if (keyIsDown(68)) this.x += this.speed.x; // D 
        if (keyIsDown(87) && this.onPlatform) this.velocity.y = -this.jumpPower.y; // W 
        if (keyIsDown(83)) this.y += this.speed.y; // S 
    }

    applyGravity() {
        if (!this.onPlatform) {
            this.velocity.add(this.gravity);
        } else {
            this.velocity.y = 0; 
        }

        this.y += this.velocity.y; 

        if (this.y >= height - this.size / 2) {
            this.onPlatform = true; 
            this.y = height - this.size / 2; 
        } else {
            this.onPlatform = false; 
        }
    }
}
