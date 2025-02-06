class Platform {
    constructor(points) {
        this.p1 = points[0];
        this.p2 = points[1];
        this.p3 = points[2];
        this.p4 = points[3];
    }

    calculateBezierCurve(t) {
        let x = Math.pow(1 - t, 3) * this.p1.x + 3 * Math.pow(1 - t, 2) * t * this.p2.x + 3 * (1 - t) * Math.pow(t, 2) * this.p3.x + Math.pow(t, 3) * this.p4.x;
        let y = Math.pow(1 - t, 3) * this.p1.y + 3 * Math.pow(1 - t, 2) * t * this.p2.y + 3 * (1 - t) * Math.pow(t, 2) * this.p3.y + Math.pow(t, 3) * this.p4.y;
        return createVector(x, y);
    }

    drawBezierCurve() {
        beginShape();
        noFill();
        for (let t = 0; t <= 1; t += 0.002) {
            let bezierPoint = this.calculateBezierCurve(t);
            vertex(bezierPoint.x, bezierPoint.y);
        }
        endShape();
        fill();
    }
    
    normalizeBezierCurve(t) {
        let bezierPoint = this.calculateBezierCurve(t);
        let length = bezierPoint.mag(); // Længden af bezierkurven
        let normalized = bezierPoint.div(length/3); // Splitter den op i x og y komposanter
        return normalized;
    } 

    static drawAllPoints(points) {
        for (let i = 0; i < points.length; i++) {
            fill(0, 255, 0);  
            circle(points[i].x, points[i].y, width * 0.02);  
        }
    }
}
