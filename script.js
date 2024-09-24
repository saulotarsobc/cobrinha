const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const gridSize = 20; // Tamanho de cada célula
const tileCount = 20; // Número de células por linha/coluna
canvas.width = canvas.height = gridSize * tileCount;

let velocityX = 0;
let velocityY = 0;

let snake = [{ x: 10, y: 10 }];
let snakeLength = 1;

let apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

let score = 0;
let speed = 100; // Velocidade inicial do jogo
let isSpeedBoosted = false;

// Atualiza a pontuação
const scoreElement = document.getElementById("score");

// Função principal do jogo
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, isSpeedBoosted ? speed / 2 : speed); // Controla a velocidade do jogo
}

// Atualiza a lógica do jogo
function update() {
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };

    // Verifica se a cobra comeu a maçã
    if (head.x === apple.x && head.y === apple.y) {
        snakeLength++;
        score++;
        scoreElement.textContent = score; // Atualiza a pontuação na tela
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
    }

    // Move a cobra
    snake.unshift(head);
    if (snake.length > snakeLength) {
        snake.pop();
    }

    // Verifica colisão com as bordas
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
    }

    // Verifica colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Desenha o jogo
function draw() {
    // Limpa a tela
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobra
    snake.forEach((part, index) => {
        context.fillStyle = index === 0 ? "#00FF00" : "#32CD32";
        context.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Desenha a maçã
    context.fillStyle = "#FF0000";
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

// Reseta o jogo
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    snakeLength = 1;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
}

// Controle do teclado
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":
            if (velocityY === 0) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (velocityY === 0) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
            if (velocityX === 0) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (velocityX === 0) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case " ":
            isSpeedBoosted = true; // Acelera a cobra ao pressionar espaço
            break;
    }
});

// Detecta quando a barra de espaço é liberada para desacelerar a cobra
document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        isSpeedBoosted = false; // Volta à velocidade normal ao soltar o espaço
    }
});

// Inicia o jogo
gameLoop();
