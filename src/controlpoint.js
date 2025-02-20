class ControlPoint {
    constructor(x, y, platform) {
      this.pos = createVector(x, y);
      this.platform = platform;
    }
  
    updatePosition(x, y) {
      this.pos.set(x, y);
      this.platform.updatePoints();
    }
  
    display(color, cameraOffset, isCurrentPlatform) {
      const margin = this.platform.game.canvasHeight * 0.02;
      let fillColor;
      if (isCurrentPlatform) {
        fillColor = color;
      } else {
        fillColor = color.map(c => c * 0.5);
      }
      fill(fillColor);
      noStroke();
      ellipse(this.pos.x, this.pos.y - cameraOffset, margin, margin);
    }
  
    isMouseOver(cameraOffset) {
      const margin = this.platform.game.canvasHeight * 0.02;
      return dist(mouseX, mouseY + cameraOffset, this.pos.x, this.pos.y) < margin;
    }
  }
  