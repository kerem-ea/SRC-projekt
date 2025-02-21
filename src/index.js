const config = {
  platformColors: {
      even: [255, 0, 0], // Rød farve til lige platforme
      odd: [0, 255, 0]   // Grøn farve til ulige platforme
  }
};

class Game {
  constructor() {
      this.state = "playing"; // Starttilstand er 'playing'
      this.cameraOffset = 0; // Kameraoffset til justering af visning
      this.dragging = null;  // Holder styr på hvilken platform der bliver trukket
      this.platforms = [];   // Array af platforme
  }

  initialize(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;  // Bredde på canvas
      this.canvasHeight = canvasHeight; // Højde på canvas
      this.jumpHeight = canvasHeight * 0.2; // Højde spilleren kan hoppe
      this.player = new Player(canvasWidth / 2, canvasHeight / 2 - 50, canvasWidth, canvasHeight); // Opret spiller
      this.generateInitialPlatforms();  // Generer initiale platforme
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
          }, this);
          this.platforms.push(platform);  // Tilføj platformen til listen
      }
  }

  updatePlayer() {
      this.player.update(this.platforms); // Opdater spillerens position
      this.player.display(this.cameraOffset); // Vis spillerens position
  }

  update() {
      if (this.state === "playing") {
          background(50, 50, 50);  // Baggrundsfarve når spillet er i gang
          this.updateGamePlay();  // Opdater spillet
      } else if (this.state === "gameOver") {
          background(0);  // Baggrundsfarve når spillet er slut
          fill(255);  // Hvid tekst
          textAlign(CENTER, CENTER);
          text("Game Over", this.canvasWidth / 2, this.canvasHeight / 2); // Vis Game Over
      }
  }

  updateGamePlay() {
      this.updateCamera(); // Opdater kameraet
      this.displayPlatforms(); // Vis platformene
      this.updatePlayer(); // Opdater spilleren
      this.generateNewPlatforms(); // Generer nye platforme
      this.checkGameOver(); // Tjek om spillet er slut
  }

  updateCamera() {
      this.cameraOffset = this.player.pos.y - this.canvasHeight / 2; // Flyt kameraet for at følge spilleren
  }

  displayPlatforms() {
      for (let i = 0; i < this.platforms.length; i++) {
          this.platforms[i].display(i, this.cameraOffset); // Vis hver platform
      }
  }

  generateNewPlatforms() {
      const highestPlatform = this.platforms[this.platforms.length - 1]; // Find den højeste platform
      if (!highestPlatform) return;
      const highestY = highestPlatform.p1.pos.y; // Hent y-positionen for den højeste platform
      if (highestY > this.player.pos.y - this.jumpHeight * 2) {  // Hvis spilleren er tæt på den sidste platform
          this.addNewPlatform(highestY); // Tilføj en ny platform
      }
  }

  addNewPlatform(baseY) {
      const spacing = (this.jumpHeight * 2 * random(0.8, 1.2)); // Afstand mellem platforme
      const newY = baseY - spacing; // Ny y-position for platformen
      const platform = new BezierPlatform({
          p1: { x: this.canvasWidth / 2 - random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY },
          p2: { x: this.canvasWidth / 2 - random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY - random(10, 30) },
          p3: { x: this.canvasWidth / 2 + random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY - random(10, 30) },
          p4: { x: this.canvasWidth / 2 + random(this.canvasWidth * 0.1, this.canvasWidth * 0.3), y: newY }
      }, this);
      this.platforms.push(platform); // Tilføj platformen
  }

  checkGameOver() {
      if (this.player.pos.y > this.canvasHeight) { // Hvis spilleren er faldet ud af skærmen
          this.state = "gameOver"; // Skift til gameOver tilstand
      }
  }

  restart() {
      this.state = "playing"; // Start spillet igen
      this.cameraOffset = 0;
      this.initialize(this.canvasWidth, this.canvasHeight); // Geninitialiser spillet
  }
}

let game;

function setup() {
  const canvasWidth = windowWidth;
  const canvasHeight = windowHeight * 0.9;
  createCanvas(canvasWidth, canvasHeight); // Opret canvas
  frameRate(60); // Sæt frame rate til 60
  textFont("Arial");
  textSize(canvasHeight * 0.05); // Sæt tekststørrelse
  game = new Game(); // Opret spillet
  game.initialize(canvasWidth, canvasHeight); // Initialiser spillet
}

function draw() {
  game.update(); // Opdater spillet hver frame
}

function mousePressed() {
  handleMousePress(game); // Håndter musetryk
}

function mouseDragged() {
  handleMouseDrag(game); // Håndter musetræk
}

function mouseReleased() {
  handleMouseRelease(game); // Håndter museløsning
}

function keyPressed() {
  handleKeyPress(game); // Håndter tastetryk
}

function handleMousePress(game) {
  for (let i = 0; i < game.platforms.length; i++) {
      const platform = game.platforms[i];
      if (platform.p1.isMouseOver(game.cameraOffset)) {
          game.dragging = platform.p1; // Start at trække platform 1
          return;
      } else if (platform.p2.isMouseOver(game.cameraOffset)) {
          game.dragging = platform.p2; // Start at trække platform 2
          return;
      } else if (platform.p3.isMouseOver(game.cameraOffset)) {
          game.dragging = platform.p3; // Start at trække platform 3
          return;
      } else if (platform.p4.isMouseOver(game.cameraOffset)) {
          game.dragging = platform.p4; // Start at trække platform 4
          return;
      }
  }
}

function handleMouseDrag(game) {
  if (game.dragging) {
      game.dragging.updatePosition(mouseX, mouseY + game.cameraOffset); // Opdater positionen for den trukne platform
  }
}

function handleMouseRelease(game) {
  game.dragging = null; // Stop med at trække platform
}

function handleKeyPress(game) {
  if (keyCode === 82) { // Hvis "r" trykkes, restart spillet
      game.restart();
  }
}
