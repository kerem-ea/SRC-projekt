class controlPoint {
    constructor() {
        this.x = random(0, width);
        this.y = random(0, height);
    }

    static drawAllPoints(points) {
        for (let i = 0; i < points.length; i++) {
            fill(0, 255, 0);
            circle(points[i].x, points[i].y, width / 20);
        }
    }
}