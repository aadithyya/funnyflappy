let board = document.getElementById("board");
let context;

let boardWidth = 360, boardHeight = 640;
let birdWidth = 34, birdHeight = 24;
let birdX = boardWidth / 8, birdY = boardHeight / 2;
let bird = { x: birdX, y: birdY, width: birdWidth, height: birdHeight };

let velocityY = 0, gravity = 0.45;
let velocityX = -3;
let openingSpace = birdHeight * 4 + 6; // gap for 2 birds

let pipeArray = [];
let pipeWidth = 64, pipeHeight = 512, pipeX = boardWidth;

let score = 0, gameOver = false;
let lastTime = 0;

let birdImg = new Image();
let topPipeImg = new Image();
let bottomPipeImg = new Image();
birdImg.src = "assets/flappybird.png";
topPipeImg.src = "assets/toppipe.png";
bottomPipeImg.src = "assets/bottompipe.png";

let jumpSound = new Audio("assets/jumbo.mp3");
let gameOverAudio = new Audio("assets/sayippp.mp3");

const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const birdUpload = document.getElementById("birdUpload");
const uploadButton = document.getElementById("uploadButton");

uploadButton.onclick = () => birdUpload.click();

startButton.onclick = () => {
    if (birdUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { birdImg.src = e.target.result; startGame(); };
        reader.readAsDataURL(birdUpload.files[0]);
    } else startGame();
};

restartButton.onclick = () => {
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;
    lastTime = 0;
    restartButton.style.display = "none";
    requestAnimationFrame(update);
};

function startGame() {
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    context.imageSmoothingEnabled = false;
    requestAnimationFrame(update);
    setInterval(placePipes, 1800);
    document.addEventListener("keydown", moveBird);
}

function moveBird(e) {
    if (e.code === "Space") {
        velocityY = -6.5;
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

function placePipes() {
    if (gameOver) return;
    let randomPipeY = -pipeHeight / 2 + Math.random() * (pipeHeight / 2);
    pipeArray.push({ img: topPipeImg, x: pipeX, y: randomPipeY, width: pipeWidth, height: pipeHeight, passed: false });
    pipeArray.push({ img: bottomPipeImg, x: pipeX, y: randomPipeY + pipeHeight + openingSpace, width: pipeWidth, height: pipeHeight, passed: false });
}

function update(time) {
    requestAnimationFrame(update);
    if (!lastTime) lastTime = time;
    if (gameOver) return;

    let delta = (time - lastTime) / 16.67;
    lastTime = time;
    velocityY += gravity * delta;
    bird.y += velocityY * delta;

    context.clearRect(0, 0, board.width, board.height);

    if (birdImg.complete && birdImg.naturalWidth)
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    else {
        context.fillStyle = "yellow";
        context.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    if (bird.y < 0 || bird.y + bird.height > board.height)
        if (!gameOver) triggerGameOver();

    for (let pipe of pipeArray) {
        pipe.x += velocityX * delta;
        if (pipe.img.complete && pipe.img.naturalWidth)
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        else {
            context.fillStyle = "green";
            context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        }
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }
    }

    for (let pipe of pipeArray)
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width &&
            bird.y + bird.height > pipe.y && bird.y < pipe.y + pipe.height)
            if (!gameOver) triggerGameOver();

    while (pipeArray.length && pipeArray[0].x + pipeWidth < 0)
        pipeArray.shift();

    context.fillStyle = "white";
    context.font = "30px monospace";
    context.fillText(Math.floor(score), 10, 40);
}

function triggerGameOver() {
    gameOver = true;
    gameOverAudio.currentTime = 0;
    gameOverAudio.play();
    restartButton.style.display = "block";
}
