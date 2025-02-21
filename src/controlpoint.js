class ControlPoint {
  constructor(x, y, platform) {
      this.pos = createVector(x, y); // Position
      this.platform = platform; // Platform reference
  }

  updatePosition(x, y) { // Opdaterer position
      this.pos.set(x, y);
      this.platform.updatePoints();
  }

  display(color, cameraOffset, isCurrentPlatform) { // Viser kontrolpunkt
      const margin = this.platform.game.canvasHeight * 0.02;
      let fillColor = isCurrentPlatform ? color : color.map(c => c * 0.5);
      fill(fillColor);
      noStroke();
      ellipse(this.pos.x, this.pos.y - cameraOffset, margin, margin);
  }

  isMouseOver(cameraOffset) { // Tjekker musens position
      const margin = this.platform.game.canvasHeight * 0.02;
      return dist(mouseX, mouseY + cameraOffset, this.pos.x, this.pos.y) < margin;
  }
}
