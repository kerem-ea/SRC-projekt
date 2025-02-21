class BezierPlatform {
  constructor(points, game) {
      this.game = game;
      this.p1 = new ControlPoint(points.p1.x, points.p1.y, this); // Kontrollpunkt 1
      this.p2 = new ControlPoint(points.p2.x, points.p2.y, this); // Kontrollpunkt 2
      this.p3 = new ControlPoint(points.p3.x, points.p3.y, this); // Kontrollpunkt 3
      this.p4 = new ControlPoint(points.p4.x, points.p4.y, this); // Kontrollpunkt 4
      this.points = this.calculatePoints(); // Beregn punkterne på bezierkurven
  }

  calculatePoints() { // Beregn 100 punkter langs bezierkurven
      const pts = [];
      for (let t = 0; t <= 1; t += 0.01) {
          pts.push(this.getBezierPoint(t)); // Tilføj hvert punkt til array
      }
      return pts;
  }

  updatePoints() { // Opdater bezierpunkterne
      this.points = this.calculatePoints();
  }

  display(index, cameraOffset) { 
      const color = (index % 2 === 0) ? config.platformColors.even : config.platformColors.odd; // Vælg farve baseret på index
      this.drawCurve(color, cameraOffset); // Tegn bezierkurve
      this.drawControlPoints(color, cameraOffset, false); // Tegn kontrolpunkter
  }

  drawCurve(color, cameraOffset) {
      push();
      stroke(color);
      strokeWeight(this.game.canvasHeight * 0.015);
      noFill(); // Ingen fyld
      beginShape();
      for (let i = 0; i < this.points.length; i++) {
          vertex(this.points[i].x, this.points[i].y - cameraOffset); // Tegn hvert punkt på kurven
      }
      endShape();
      pop();
  }

  drawControlPoints(color, cameraOffset) { // Tegn kontrolpunkter
      this.p1.display(color, cameraOffset); 
      this.p2.display(color, cameraOffset);
      this.p3.display(color, cameraOffset);
      this.p4.display(color, cameraOffset);
  }

  checkCollisions(player) { // Kollisionsdetektion
      let playerBottom = player.pos.y + player.size / 2; 
      let closestT = 0;
      let closestDist = Infinity; // Start med en meget stor afstand
      
      for (let i = 0; i <= 100; i++) { // Udregn punkter langs bezierkurven og find det nærmeste
          let t = i / 100;
          let point = this.getBezierPoint(t); 
          let distX = Math.abs(player.pos.x - point.x); // Beregn afstand til player
          if (distX < closestDist) { // Opdater korteste afstand
              closestDist = distX;
              closestT = t;
          }
      }

      let platformY = this.bezierY(closestT);  // Beregn y-positionen på bezierkurven
      
      if (Math.abs(playerBottom - platformY) <= player.size && player.vel.y >= 0) { // Spilleren er tæt på platform og bevæger sig ned
          player.pos.y = platformY - player.size / 2; // Sæt spillerens position
          player.vel.y = 0; // Stop nedadgående bevægelse
          return true;
      }

      return false;
  }

  bezierY(t) { // Beregn y-komponenten på bezierkurven
      let y1 = this.p1.pos.y, y2 = this.p2.pos.y, y3 = this.p3.pos.y, y4 = this.p4.pos.y;
      let yt = 
          (1 - t) ** 3 * y1 + 
          3 * (1 - t) ** 2 * t * y2 + 
          3 * (1 - t) * t ** 2 * y3 + 
          t ** 3 * y4;
      return yt;
  }

  getBezierPoint(t) { // Beregn et punkt på bezierkurven
      return customBezier(this.p1.pos, this.p2.pos, this.p3.pos, this.p4.pos, t);
  }
}

function customBezier(p0, p1, p2, p3, t) { // Beregn kubisk bezierkurve
  const p01 = lerpVec(p0, p1, t);
  const p12 = lerpVec(p1, p2, t);
  const p23 = lerpVec(p2, p3, t);
  const p012 = lerpVec(p01, p12, t);
  const p123 = lerpVec(p12, p23, t);
  return lerpVec(p012, p123, t);
}

function lerpVec(v0, v1, t) { // Linear interpolation mellem to vektorer
  return createVector(lerp(v0.x, v1.x, t), lerp(v0.y, v1.y, t));
}
