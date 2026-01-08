const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, score;
let game;
let aiMode = false;

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = randomFood();
    direction = "RIGHT";
    score = 0;
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };
}

document.addEventListener("keydown", e => {
    if (!aiMode) {
        if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }
});

function aiMove() {
    let head = snake[0];

    if (head.x < food.x) direction = "RIGHT";
    else if (head.x > food.x) direction = "LEFT";
    else if (head.y < food.y) direction = "DOWN";
    else if (head.y > food.y) direction = "UP";
}

function collision(head, body) {
    return body.some(seg => seg.x === head.x && seg.y === head.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (aiMode) aiMove();

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        collision(head, snake)
    ) {
        clearInterval(game);
        alert("Game Over! Score: " + score);
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function startManual() {
    aiMode = false;
    restartGame();
}

function startAI() {
    aiMode = true;
    restartGame();
}

function restartGame() {
    clearInterval(game);
    initGame();
    game = setInterval(draw, 120);
}

initGame();
game = setInterval(draw, 120);
