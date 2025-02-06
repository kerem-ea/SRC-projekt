let points = [];
let player;
let platform;

const config = {
    frameRate: 60,
    backgroundColor: [255, 0, 0],
    playerColor: [0, 255, 0],
    gameSize: 0.8,
};

function setup() {
    let canvas = createCanvas(windowWidth * config.gameSize, windowHeight * config.gameSize);
    canvas = centerCanvas(canvas);
    config.gameWidth = width;
    config.gameHeight = height;

    p1 = { x: Math.random() * width, y: Math.random() * height };
    p2 = { x: Math.random() * width, y: Math.random() * height };
    p3 = { x: Math.random() * width, y: Math.random() * height };
    p4 = { x: Math.random() * width, y: Math.random() * height };

    points = [p1, p2, p3, p4];

    platform = new Platform(points, width, height);

    frameRate(config.frameRate);
    background(config.backgroundColor);
    player = new Player();
    initializePoints();
}

function draw() {
    background(config.backgroundColor);
    player.show();
    player.move();
    controlPoint.drawAllPoints(points); 
    platform.showCurve();
    playerFunctions()
}

function centerCanvas(canvas) {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
    return canvas;
}

function initializePoints() {
    points.push(new controlPoint());
    points.push(new controlPoint());
}
function playerFunctions() {
    player.move();
    player.handleGravity();
    player.show();
    player.isOnPlatform(); 
    player.outOfBounds();
}
