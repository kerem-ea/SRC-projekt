const config = {
    platformColors: {
      even: [255, 0, 0],
      odd: [0, 255, 0]
    }
  };
  
  class Game {
    constructor() {
        this.state = "playing";
        this.energy = 100;
        this.floorCount = 0;
        this.cameraOffset = 0;
        this.dragging = null;
        this.platforms = [];
    }

    initialize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.jumpHeight = canvasHeight * 0.2;
        this.player = new Player(canvasWidth / 2, canvasHeight / 2 - 50, canvasWidth, canvasHeight);
        this.generateInitialPlatforms();  // Ensure platforms are generated
    }

    generateInitialPlatforms() {
        const platformConfigs = [
            { y: this.canvasHeight - this.canvasHeight * 0.05, width: 0.1, height: 0.1 },
            { y: this.canvasHeight - this.canvasHeight * 0.3, width: 0.2, height: 0.35 },
            { y: this.canvasHeight - this.canvasHeight * 0.5, width: 0.3, height: 0.55 }
        ];
        for (let i = 0; i < platformConfigs.length; i++) {
            const cfg = platformConfigs[i];
            const platform = new BezierPlatform({
                p1: { x: this.canvasWidth / 2 - this.canvasWidth * cfg.width, y: cfg.y },
                p2: { x: this.canvasWidth / 2, y: cfg.y - this.canvasHeight * cfg.height },
                p3: { x: this.canvasWidth / 2 + this.canvasWidth * cfg.width, y: cfg.y - this.canvasHeight * cfg.height },
                p4: { x: this.canvasWidth / 2 + this.canvasWidth * (cfg.width + 0.1), y: cfg.y }
            }, this.energy, this);
            this.platforms.push(platform);
        }
        console.log(this.platforms); // Debugging: Check the platforms array
    }

    updatePlayer() {
        this.player.update(this.platforms); // Passing platforms to player
        this.player.display(this.cameraOffset);
    }
  
    update() {
      if (this.state === "playing") {
        background(50, 50, 50);
        this.updateGamePlay();
      } else if (this.state === "gameOver") {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Game Over", this.canvasWidth / 2, this.canvasHeight / 2);
      }
    }
  
    updateGamePlay() {
      this.updateCamera();
      this.displayPlatforms();
      this.updatePlayer();
      this.generateNewPlatforms();
      this.checkGameOver();
    }
  
    updateCamera() {
      this.cameraOffset = this.player.pos.y - this.canvasHeight / 2;
    }
  
    displayPlatforms() {
      for (let i = 0; i < this.platforms.length; i++) {
        this.platforms[i].display(i, this.cameraOffset);
      }
    }
  
    generateNewPlatforms() {
      const highestPlatform = this.platforms[this.platforms.length - 1];
      if (!highestPlatform) return;
      const highestY = highestPlatform.p1.pos.y;
      if (highestY > this.player.pos.y - this.jumpHeight * 2) {
        this.addNewPlatform(highestY);
      }
    }
  
    addNewPlatform(baseY) {
      const spacing = (this.jumpHeight * 2 * random(0.8, 1.2)) * (1 + (this.floorCount / 100));
      const newY = baseY - spacing;
      const platform = new BezierPlatform({
        p1: { x: this.canvasWidth / 2 - random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY },
        p2: { x: this.canvasWidth / 2 - random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY - random(10, 30) },
        p3: { x: this.canvasWidth / 2 + random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY - random(10, 30) },
        p4: { x: this.canvasWidth / 2 + random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY }
      }, this.energy, this);
      this.platforms.push(platform);
    }
  
    checkGameOver() {
      if (this.player.pos.y > this.canvasHeight) {
        this.state = "gameOver";
      }
    }
  
    
    restart() {
      this.state = "playing";
      this.energy = 100;
      this.floorCount = 0;
      this.cameraOffset = 0;
      this.initialize(this.canvasWidth, this.canvasHeight);
    }
  }
  
  let game;
  
  function setup() {
    const canvasWidth = windowWidth;
    const canvasHeight = windowHeight * 0.9;
    createCanvas(canvasWidth, canvasHeight);
    frameRate(60);
    textFont("Arial");
    textSize(canvasHeight * 0.05);
    game = new Game();
    game.initialize(canvasWidth, canvasHeight);
  }
  
  function draw() {
    game.update();
  }
  
  function mousePressed() {
    handleMousePress(game);
  }
  
  function mouseDragged() {
    handleMouseDrag(game);
  }
  
  function mouseReleased() {
    handleMouseRelease(game);
  }
  
  function keyPressed() {
    handleKeyPress(game);
  }
  
  function handleMousePress(game) {
    for (let i = 0; i < game.platforms.length; i++) {
      const platform = game.platforms[i];
      if (platform.p1.isMouseOver(game.cameraOffset)) {
        game.dragging = platform.p1;
        return;
      } else if (platform.p2.isMouseOver(game.cameraOffset)) {
        game.dragging = platform.p2;
        return;
      } else if (platform.p3.isMouseOver(game.cameraOffset)) {
        game.dragging = platform.p3;
        return;
      } else if (platform.p4.isMouseOver(game.cameraOffset)) {
        game.dragging = platform.p4;
        return;
      }
    }
  }
  
  function handleMouseDrag(game) {
    if (game.dragging) {
      game.dragging.updatePosition(mouseX, mouseY + game.cameraOffset);
    }
  }
  
  function handleMouseRelease(game) {
    game.dragging = null;
  }
  
  function handleKeyPress(game) {
    if (keyCode === 27) {
      // Toggle pause.
      game.state = (game.state === "playing") ? "paused" : "playing";
    } else if (keyCode === 82) {
      // "R" key to restart.
      game.restart();
    } 
  }
  