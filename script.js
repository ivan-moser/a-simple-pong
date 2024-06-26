'use strict';


//VARIABILI

let board;
let boardWidth = 900;
let boardHeight = 900;
let context;
let maxScore = 10;

// PALLA

let ballWidth = 20;
let ballHeight = 20;

let ballDefaultX = (boardWidth/2)-ballWidth/2;
let ballDefaultY = (boardHeight/2)-ballHeight/2;

let ball = {
    positionX : (boardWidth/2)-ballWidth/2,
    positionY : (boardHeight/2)-ballHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : 1,
    velocityY : 2, 
}

// GIOCATORI

let playerWidth = 10;
let playerHeight = 100;
let playerVelocityY = 0;

let player1DefaultY = (boardHeight / 2)- playerHeight/2;
let player1DefaultX = 30;

let player2DefaultY = (boardHeight / 2)- playerHeight/2;
let player2DefaultX = boardWidth - 30 - playerWidth;

let player1 = {
    positionX : 30,
    positionY : (boardHeight / 2)- playerHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocity : playerVelocityY,
}

let player2 = {
    positionX : boardWidth - 30 - playerWidth,
    positionY : (boardHeight / 2)- playerHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocity : playerVelocityY,
}

let player1Score = 0;
let player2Score = 0;
let gameState = 'START'

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    requestAnimationFrame(update);

    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(e) {
        if (gameState === 'START') {
            context.fillRect(0,0, boardWidth, boardHeight);
            gameState = 'GAME';
        } else {
            keyHandler(e);
        }
    }
}

 function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardWidth, boardHeight);

    if (player1Score == maxScore || player2Score == maxScore) {
        gameState = 'WINNER';
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// GAME CASES /////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    
    switch (gameState) {

        case 'GAME' : {
            drawCentralLine();
            context.fillRect(player1.positionX, player1.positionY, player1.width, player1.height);

            //SCOREBOARDS GENERATION
            //SB-PLAYER1
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player1Score,(boardWidth/4)-50,(boardWidth/2)+100);
            //SB-PLAYER2
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player2Score,((boardWidth/4)*3)-100,(boardWidth/2)+100);

            // PLAYER 1

            context.fillStyle = '#ff7f50';
            let nextPlayer1Y = player1.positionY + player1.velocity;
            // devo verificare che la posizione non sia fuori dai bordi
            // se fuori dai bordi allora mantieni la posizione di prima
            if (!outOfBounds(nextPlayer1Y)) {
                player1.positionY = nextPlayer1Y;
            }
            
            context.fillRect(player1.positionX, player1.positionY, player1.width, player1.height);

            // PLAYER 2

            context.fillStyle = '#ff7f50';

            let nextPlayer2Y = player2.positionY + player2.velocity;
            if (!outOfBounds(nextPlayer2Y)) {
                player2.positionY = nextPlayer2Y;
            }

            context.fillRect(player2.positionX, player2.positionY, player2.width, player2.height);

            // BALL

            ball.positionX += ball.velocityX;
            ball.positionY += ball.velocityY;

            context.fillRect(ball.positionX, ball.positionY, ball.width, ball.height);

            if (ballOutOfBounds(ball.positionY)) {
                ball.velocityY *= -1;
            }

            // COLLISION
            if (detectCollision(ball, player1) || detectCollision(ball, player2)) {
                updateBallVelocity(ball, detectCollision(ball, player1) ? player1 : player2);
            }

            if (ball.positionX <= 0) {
                ball.positionX = ballDefaultX;
                ball.positionY = ballDefaultY;

                player2Score++;
                ball.velocityX *= -1;
                console.log(player1Score);
            }

            if (ball.positionX + ball.width >= boardWidth) {
                ball.positionX = ballDefaultX;
                ball.positionY = ballDefaultY;

                player1Score++;
                ball.velocityX *= -1; 
                console.log(player2Score);
            }
            break;
        }
        
        case 'START' : {

            //PLAYER 1
            context.fillStyle = '#ff7f50';
            context.fillRect(player1DefaultX, player1DefaultY, player1.width, player1.height);

            //PLAYER 2
            context.fillStyle = '#ff7f50';
            context.fillRect(player2DefaultX, player2DefaultY, player2.width, player2.height);

            //BALL
            context.fillStyle = '#ff7f50';
            context.fillRect(ballDefaultX, ballDefaultY, ball.width, ball.height);

            //TEXT
            context.fillStyle = 'rgba(149, 149, 149, 0.5)';
            context.font = "italic 32px vt323"
            context.fillText('>> Press ESC to pause the game', (boardWidth/2) - 375, ((boardHeight/4)*3));
            context.fillText('>> Press W to move player 1 UP', (boardWidth/2) - 375, ((boardHeight/4)*3)+60);
            context.fillText('>> Press S to move player 1 DOWN', (boardWidth/2) - 375, ((boardHeight/4)*3)+90);

            context.fillText(">> Press \u25B2 to move player 2 UP", (boardWidth/2) - 375, ((boardHeight/4)*3)+150);
            context.fillText('>> Press \u25BC to move player 2 DOWN', (boardWidth/2) - 375, ((boardHeight/4)*3)+180);

            if (isTextVisible) {
                drawText('>> PRESS SOMETHING TO START', (boardWidth/2) - 375);
            }
        }
        break;

        case 'PAUSE' : {

            //SCOREBOARDS GENERATION
            //SB-PLAYER1
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player1Score,(boardWidth/4)-50,(boardWidth/2)+100);
            //SB-PLAYER2
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player2Score,((boardWidth/4)*3)-100,(boardWidth/2)+100);

            //PLAYER 1
            context.fillStyle = '#ff7f50';
            context.fillRect(player1.positionX, player1.positionY, player1.width, player1.height);

            //RESET
            context.fillStyle = 'rgba(149, 149, 149, 0.5)';
            context.font = "italic 32px vt323"
            context.fillText('>> Press R to restart the game', (boardWidth/2) - 375, ((boardHeight/4)*3));

            //PLAYER 2
            context.fillStyle = '#ff7f50';
            context.fillRect(player2.positionX, player2.positionY, player2.width, player2.height);

            //BALL
            context.fillStyle = '#ff7f50';
            context.fillRect(ball.positionX, ball.positionY, ball.width, ball.height);

            if (isTextVisible) {
                drawText('>> PRESS SOMETHING TO START', (boardWidth/2) - 375);
            }

        }
        break;

        case 'WINNER' : {
            context.clearRect(0, 0, boardWidth, boardHeight);

            //SCOREBOARDS GENERATION
            //SB-PLAYER1
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player1Score,(boardWidth/4)-50,(boardWidth/2)+100);
            //SB-PLAYER2
            context.fillStyle = 'rgba(48, 48, 48, 0.2)';
            context.font = "bold 300px impact";
            context.fillText(player2Score,((boardWidth/4)*3)-100,(boardWidth/2)+100);

            //WINNER
            if (isTextVisible) {
                drawText(player1Score==10 ? 'PLAYER 1 HAS WON THE GAME!' : 'PLAYER 1 HAS WON THE GAME!', (boardWidth/2) - 370);
            }

            //TEXT
            context.fillStyle = 'rgba(149, 149, 149, 0.5)';
            context.font = "italic 32px vt323"
            context.fillText('>> Press R to restart the game', (boardWidth/2) - 375, ((boardHeight/4)*3));
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// FUNCTIONS //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//  KEYS EVENT HANDLER

function keyHandler(e) {
    // PLAYER 1
    if (e.code == 'KeyW') {
        player1.velocity = -3;
    }
    else if(e.code == 'KeyS') {
        player1.velocity = 3 
    }
    // PLAYER 2
    if(e.code == 'ArrowUp'){
        player2.velocity = -3;
    }
    else if(e.code == 'ArrowDown'){
        player2.velocity = 3; 
    }
    // ESC in game
     else if (e.code == "Escape" && gameState == 'GAME') {
        gameState = 'PAUSE';
    } 
    // ESC in pause
    else if (e.code == "Escape" && gameState == 'PAUSE') {
        gameState = 'GAME';
    } 
    // R for restart
    else if (e.code == "KeyR" && ((gameState == 'PAUSE') || (gameState == 'WINNER'))) {
        statsReset();
        gameState = 'START';
    }
    
}

//Stats reset
function statsReset() {
    player1Score = 0;
    player2Score = 0;
}


//Out of bound player detection
function outOfBounds(yPosition) {
    return ((yPosition <= 0) || yPosition >= (boardHeight - playerHeight));
}


//Out of bound ball detection
function ballOutOfBounds(yPosition) {
    return ((yPosition <= 0) || yPosition >= (boardHeight - ballHeight));
}


//Ball --> Player Collision detection
function detectCollision(ball, player) {
    return ball.positionX < player.positionX + player.width &&
    ball.positionX + ball.width > player.positionX &&
    ball.positionY < player.positionY + player.height &&
    ball.positionY + ball.height > player.positionY;
}

//Angle of direction
function angleCalculator(ball, player) {
    let mid = player.positionY + (player.height / 2);
    let dist = (ball.positionY + (ball.height / 2)) - mid;
    let bounceAngle = dist / (player.height / 2) * (Math.PI / 4);

    return bounceAngle;
}

//Update of the velocity with the bounceAngle
function updateBallVelocity(ball, player) {
    let angle = angleCalculator(ball, player);
    let speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY); 

    ball.velocityX = (player === player1 ? 1 : -1) * speed * Math.cos(angle);
    ball.velocityY = speed * Math.sin(angle);
}


//START Text management
function drawText(text, x) {
    context.font = "bold 35px Silkscreen"
    context.fillStyle = '#ff7f50';
    context.fillText(text, x, boardHeight/4);
}

function clearText() {
    context.clearRect(0, 0, boardWidth, boardHeight);
}

var isTextVisible = true;
setInterval(function () {
    isTextVisible = !isTextVisible;
}, 750);


//Cerntral line
function drawCentralLine() {
    context.strokeStyle = 'rgba(30, 30, 30, 0.3)';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(boardWidth / 2, 0);
    context.lineTo(boardWidth / 2, boardHeight);
    context.stroke();
}





 
