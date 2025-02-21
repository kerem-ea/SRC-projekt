class Player {
  constructor(x, y, canvasWidth, canvasHeight) {
      this.pos = createVector(x, y); // Player x-position og y-position som vektor
      this.vel = createVector(0, 0); // Player hastighed
      this.acc = createVector(0, 0); // Player acceleration
      this.size = canvasHeight * 0.05; // Player størrelse
      this.canvasWidth = canvasWidth; 
      this.canvasHeight = canvasHeight;
      this.onGround = false; // Player onGround boolean
  }

  update(platforms) { 
      this.acc.set(0, 1);  

      if (keyIsDown(LEFT_ARROW)) this.acc.x = -1; // Rykker til venstre med venstrepiltast
      if (keyIsDown(RIGHT_ARROW)) this.acc.x = 1; // Rykker til højere med højrepiltast

      if (keyIsDown(UP_ARROW) && this.onGround) { // Hopper med opadpiltast
          this.vel.y = -22;
          this.onGround = false; // Sætter onGround til falsk
      }

      this.vel.add(this.acc); // Hastighed stiger med acceleration
      this.pos.add(this.vel); // Spiller position ændrer sig baseret på hastighed

      this.onGround = false; // Sætter løbende onGround til falsk, så den kun er sandt, hvis spilleren er på en platform

      for (let i = 0; i < platforms.length; i++) { //Itererer gennem platform array
          let platform = platforms[i]; // Sætter platform til den nuværende platform på i's position i arrayet
          if (platform instanceof BezierPlatform && platform.checkCollisions(this)) { // Hvis spilleren er på platform, sæt onGround til true
              this.onGround = true;
              break;
          }
      }

      this.vel.x *= 0.9;
      this.pos.x = constrain(this.pos.x, 0, this.canvasWidth);
  }
  
    display(cameraOffset) {
      push();
      fill(0, 0, 255);
      ellipse(this.pos.x, this.pos.y - cameraOffset, this.size);
      pop();
    }
  }
  


  