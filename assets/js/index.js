console.log("Loaded JS");
const gameGrid=document.getElementById('game-grid');
const bar=document.getElementById('movable-bar')
const ball = document.getElementById('ball');
const bricksContainer = document.getElementById('bricks');
const oldScoreDisplay=document.getElementById('last-score');
const scoreDisplay = document.getElementById('score');
const lifesDisplay = document.getElementById('life');
const pressEnter = document.getElementById('press-start');
const audioBGM = document.getElementById('background-audio');
audioBGM.volume = 0.1;
const audioFXBrick = new Audio('assets/audios/8-bit-explosion.mp3');
audioFXBrick.volume = 0.2;
const audioFXBar = new Audio('assets/audios/barHit.mp3');
audioFXBar.volume = 0.2;
let game=false;
let lifes=3;
let lastTime=0;
let score = 0;
let ballX = 50;
let ballY = 50;
let velocityX = 2;
let velocityY = 2;
var bricks = [];
let barSpeed = 20;
const brickRows = 4;
const brickColumns = 6;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 8;
const brickOffsetTop = 0;
const brickOffsetLeft = 0;
bar.style.left = `${gameGrid.offsetWidth / 2 - bar.offsetWidth / 2}px`;
function createBricks() {
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            let brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.left = `${c * (brickWidth + brickPadding) + brickOffsetLeft}px`;
            brick.style.top = `${r * (brickHeight + brickPadding) + brickOffsetTop}px`;
            brick.style.backgroundColor=`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
            brick.style.position = "absolute";
            bricksContainer.appendChild(brick);
            bricks.push(brick);
        }
    }
}
function moveBall() {
    if (!game) {
        return;
    }
    ballX += velocityX;
    ballY += velocityY;
    if (ballX <= 0 || ballX + ball.offsetWidth >= gameGrid.offsetWidth) {
        velocityX *= -1;
    }
    if (ballY + ball.offsetHeight >= gameGrid.offsetHeight-200) {
        lifes--;
        lifesDisplay.innerText = lifes;
        if (lifes <= 0) {
            pressEnter.style.display = "flex";
            pressEnter.style.color = "red";
            audioBGM.pause();
            pressEnter.innerText = "Game Over! Press R restart";
            localStorage.setItem("last-played-data", 
                JSON.stringify({
                    score: score,
                    lifes: lifes,
                    time: new Date()
                })
            );
            game=false;
            return;
        }
        resetBall();
    }
    if (ballY+ball.offsetHeight <= -220) {
        velocityY *= -1;
    }
    var ballRect = ball.getBoundingClientRect();
    var barRect = bar.getBoundingClientRect();
    if (
        ballRect.bottom >= barRect.top &&
        ballRect.top <= barRect.bottom &&         
        ballRect.left <= barRect.right &&         
        ballRect.right >= barRect.left
    ) {
        velocityY = -Math.abs(velocityY);
        const paddleCenter = barRect.left + barRect.width / 2;
        const ballCenter = ballRect.left + ballRect.width / 2;
        const offset = (ballCenter - paddleCenter) / (barRect.width / 2);
        velocityX += offset * 2;
        audioFXBar.play();
    }
    
    for(let i=0;i<bricks.length;i++){
        let brick=bricks[i];
        ballRect = ball.getBoundingClientRect();
        var brickRect=brick.getBoundingClientRect();
        if (
            ballRect.right > brickRect.left &&
            ballRect.left < brickRect.left + brick.offsetWidth &&
            ballRect.top  >= brickRect.top &&
            ballRect.top <= brickRect.top + brick.offsetHeight
        ) {
            
            barSpeed+=0.5;
            if (velocityY > 0) {
                velocityY+=0.02;
            } else {
                velocityY-=0.02;
            }
            velocityY *= -1;
            brick.remove();
            bricks.splice(i, 1);
            score++;
            scoreDisplay.innerText =score;
            audioFXBrick.play();
            break;
        }
    }
    
    if (bricks.length === 0) {
        pressEnter.style.display = "flex";
        pressEnter.style.color = "greenyellow";
        audioBGM.pause();
        pressEnter.innerText = "You Win! Press R restart";
        localStorage.setItem("last-played-data", 
            JSON.stringify({
                score: score,
                lifes: lifes,
                time: new Date()
            })
        );
        game=false;
        return
    }
    
    
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    requestAnimationFrame(moveBall)
}

function resetBall() {
    ballX = 50;
    ballY = 50;
    velocityX = 2;
    velocityY = 2;
}

function addMobileControls() {
    const d=document.getElementById('mobile-controls');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const restartButton = document.getElementById('restart-button');
    const startButton = document.getElementById('start-button');
    d.style.display = "flex";
    leftButton.addEventListener('touchend', (e) => {
        if(game) moveBar(-barSpeed);
        e.preventDefault();
    });

    rightButton.addEventListener('touchend', (e) => {
        if(game) moveBar(barSpeed);
        e.preventDefault();
    });

    startButton.addEventListener('touchend', function (e) {
        game=true;
        pressEnter.style.display = "none";
        audioBGM.play();
        moveBall();
        e.preventDefault();
    });

    restartButton.addEventListener('touchend', (e) => {
        location.reload();
        e.preventDefault();
    });

}

function addDesktopControls() {
    window.addEventListener("keypress", (e) => {
        switch (e.key.toUpperCase()) {
            case "A":
                moveBar(-barSpeed);
                break;
            case "D":
                moveBar(barSpeed);
                break;
            case "ENTER":
                game=true;
                pressEnter.style.display = "none";
                audioBGM.play();
                moveBall();
                break;
            case "R":
                location.reload();
                break;
        }
    });
}

function moveBar(delta) {
    const containerWidth = bar.parentElement.offsetWidth;
    const barWidth = bar.offsetWidth;
    const maxRight = containerWidth - barWidth;
    let currentPosition = parseInt(getComputedStyle(bar).left, 10);
    const newPos = currentPosition + delta;
    if (newPos >= 0 && newPos <= maxRight) {
        bar.style.left = `${newPos}px`;
    }
}

const last_data=localStorage.getItem("last-played-data");
if (last_data) {
    const data = JSON.parse(last_data);
    oldScoreDisplay.innerText = data.score;
}
createBricks();
const isMobile =/Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
    pressEnter.innerText = "Press S button to start";
    addMobileControls();
} else {
    addDesktopControls();
}




