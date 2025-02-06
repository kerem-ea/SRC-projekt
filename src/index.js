let points = [];
let player;
let platform;
let t = 0;

const config = {
    frameRate: 144,
    backgroundColor: [169, 169, 169], 
    playerColor: [0, 255, 0],
    gameSize: 0.8,
};

function setup() {
    let canvas = createCanvas(windowWidth * config.gameSize, windowHeight * config.gameSize);
    canvas = centerCanvas(canvas);
    config.gameWidth = width;
    config.gameHeight = height;
    frameRate(config.frameRate);

    p1 = { x: Math.random() * width, y: Math.random() * height };
    p2 = { x: Math.random() * width, y: Math.random() * height };
    p3 = { x: Math.random() * width, y: Math.random() * height };
    p4 = { x: Math.random() * width, y: Math.random() * height };

    points = [p1, p2, p3, p4];

    player = new Player();
    platform = new Platform(points);
}

function draw() {
    background(config.backgroundColor); 
    ControlPoint.drawAllPoints(points);

    progress_t_Value(); 
    playerFunctions();
}

function progress_t_Value() {
    for (let t = 0; t <= 1; t += 0.002) {
        let bezierPoint = platform.calculateBezierCurve(t);
        fill(255, 0, 255);  
        circle(bezierPoint.x, bezierPoint.y, width * 0.015);  

        let normalizedPoint = platform.normalizeBezierCurve(t);
        fill(255, 0, 0);  
        circle(normalizedPoint.x * width, normalizedPoint.y * height, width * 0.03);  
    }
}

function centerCanvas(canvas) {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
    return canvas;
}

function playerFunctions() {
    player.move();
    player.applyGravity();
    player.show();
}
