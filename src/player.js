class Player {
  constructor(x, y, canvasWidth, canvasHeight) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.size = canvasHeight * 0.05;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.onGround = false;
  }

  update(platforms) {
      this.acc.set(0, 1);  // Apply gravity

      if (keyIsDown(LEFT_ARROW)) this.acc.x = -1;
      if (keyIsDown(RIGHT_ARROW)) this.acc.x = 1;

      if (keyIsDown(UP_ARROW) && this.onGround) {
          this.vel.y = -22;
          this.onGround = false;
      }

      this.vel.add(this.acc);
      this.pos.add(this.vel);

      this.onGround = false;
      // Corrected: Ensure checkCollisions is on a valid platform
      for (let i = 0; i < platforms.length; i++) {
          let platform = platforms[i];
          if (platform instanceof BezierPlatform && platform.checkCollisions(this)) {
              this.onGround = true;
              break;
          }
      }

      this.vel.x *= 0.9;
      this.pos.x = constrain(this.pos.x, 0, this.canvasWidth);
  }
  
    checkCollisions(platforms) {
      for (let i = 0; i < platforms.length; i++) {
        if (platforms[i].checkCollisions(this)) {
          return true;
        }
      }
      return false;
    }
    

    updateMovement() {
      if (keyIsDown(LEFT_ARROW)) {
        this.acc.x = -1;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.acc.x = 1;
      }
      // Jump only if on the ground.
      if (keyIsDown(UP_ARROW) && this.onGround) {
        this.vel.y = -15;
        this.onGround = false;
      }
    }
  
    applyGravity() {
      this.acc.y += 1.0;
    }
  
    checkBoundaries() {
      this.pos.x = constrain(this.pos.x, 0, this.canvasWidth);
    }
  
    display(cameraOffset) {
      push();
      fill(0, 0, 255);
      ellipse(this.pos.x, this.pos.y - cameraOffset, this.size);
      pop();
    }
  }
  