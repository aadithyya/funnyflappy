let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let bird = { x: 45, y: 320, width: 34, height: 24 };

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let birdImg = new Image();
let topPipeImg = new Image();
let bottomPipeImg = new Image();

let imagesLoaded = 0;

function imageReady() {
    imagesLoaded++;
    if (imagesLoaded === 3) {
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
    }
}

window.onload = () => {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdImg.onload = imageReady;
    topPipeImg.onload = imageReady;
    bottomPipeImg.onload = imageReady;

    birdImg.src = "flappybird.png";
    topPipeImg.src = "toppipe.png";
    bottomPipeImg.src = "bottompipe.png";

    document.addEventListener("keydown", moveBird);

    context.fillStyle = "white";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y += velocityY;

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) gameOver = true;

    for (let pipe of pipeArray) {
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (detectCollision(bird, pipe)) gameOver = true;
    }

    context.fillStyle = "white";
    context.font = "30px monospace";
    context.fillText(score, 10, 40);
}

function placePipes() {
    if (gameOver) return;

    let y = -Math.random() * 300;

    pipeArray.push({
        img: topPipeImg,
        x: boardWidth,
        y: y,
        width: pipeWidth,
        height: pipeHeight
    });

    pipeArray.push({
        img: bottomPipeImg,
        x: boardWidth,
        y: y + pipeHeight + 160,
        width: pipeWidth,
        height: pipeHeight
    });

    score++;
}

function moveBird(e) {
    if (e.code === "Space") {
        velocityY = -6;
        if (gameOver) {
            bird.y = 320;
            velocityY = 0;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
