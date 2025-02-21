class BezierPlatform {
    constructor(points, game) {
      this.game = game;
      this.p1 = new ControlPoint(points.p1.x, points.p1.y, this);
      this.p2 = new ControlPoint(points.p2.x, points.p2.y, this);
      this.p3 = new ControlPoint(points.p3.x, points.p3.y, this);
      this.p4 = new ControlPoint(points.p4.x, points.p4.y, this);
      this.originalCenter = this.getBezierPoint(0.5);
      this.points = this.calculatePoints();
    }
  
    calculatePoints() {
      const pts = [];
      for (let t = 0; t <= 1; t += 0.01) {
        pts.push(this.getBezierPoint(t));
      }
      return pts;
    }
  
    updatePoints() {
      this.points = this.calculatePoints();
    }
  
    display(index, cameraOffset) {
      const color = (index % 2 === 0) ? config.platformColors.even : config.platformColors.odd;
      this.drawCurve(color, cameraOffset);
      this.drawControlPoints(color, cameraOffset, false);
    }
  
    drawCurve(color, cameraOffset) {
      push();
      stroke(color);
      strokeWeight(this.game.canvasHeight * 0.015);
      noFill();
      beginShape();
      for (let i = 0; i < this.points.length; i++) {
        vertex(this.points[i].x, this.points[i].y - cameraOffset);
      }
      endShape();
      pop();
    }
  
    drawControlPoints(color, cameraOffset, isCurrentPlatform) {
      this.p1.display(color, cameraOffset, isCurrentPlatform);
      this.p2.display(color, cameraOffset, isCurrentPlatform);
      this.p3.display(color, cameraOffset, isCurrentPlatform);
      this.p4.display(color, cameraOffset, isCurrentPlatform);
    }
  
    checkCollisions(player) {
        let playerBottom = player.pos.y + player.size / 2;
        let closestT = 0;
        let closestDist = Infinity;
        
        for (let i = 0; i <= 100; i++) { 
            let t = i / 100;
            let point = this.getBezierPoint(t);
            let distX = Math.abs(player.pos.x - point.x);
            
            if (distX < closestDist) {
                closestDist = distX;
                closestT = t;
            }
        }
        
        let platformY = this.bezierY(closestT);
    
        const margin = player.size;
        if (playerBottom >= platformY - margin && playerBottom <= platformY + margin && player.vel.y >= 0) {
            player.pos.y = platformY - player.size / 2; 
            player.vel.y = 0; 
            return true;
        }
        
        return false;
    }
    
    bezierY(t) {
        let y1 = this.p1.pos.y, y2 = this.p2.pos.y, y3 = this.p3.pos.y, y4 = this.p4.pos.y;
        let yt = 
            (1 - t) ** 3 * y1 + 
            3 * (1 - t) ** 2 * t * y2 + 
            3 * (1 - t) * t ** 2 * y3 + 
            t ** 3 * y4;
        return yt;
    }
    
    getBezierPoint(t) {
      return customBezier(this.p1.pos, this.p2.pos, this.p3.pos, this.p4.pos, t);
    }
  }
  
  function customBezier(p0, p1, p2, p3, t) {
    const p01 = lerpVec(p0, p1, t);
    const p12 = lerpVec(p1, p2, t);
    const p23 = lerpVec(p2, p3, t);
    const p012 = lerpVec(p01, p12, t);
    const p123 = lerpVec(p12, p23, t);
    return lerpVec(p012, p123, t);
  }
  
  function lerpVec(v0, v1, t) {
    return createVector(lerp(v0.x, v1.x, t), lerp(v0.y, v1.y, t));
  }
  
  