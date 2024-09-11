document.addEventListener("DOMContentLoaded", function(){

    let gameStart = false;
    let leftBarMoves = false;
    let rightBarMoves = true;

    let leftPlayerScore = 0;
    let rightPlayerScore = 0;
    const score = 10;

    let gameRound = 5;
    let gameRoundIntervel = 1000;

    let cellSize = 2.5;
    let arenaHeight = 600;
    let arenaWidth = 800;
    let ballSize = 2.5;
    let barHeight = 20;

    let ballPosition = {x: 50, y: 50}
    let leftBarPosition = {x:5, y:40}
    let rightBarPosition = {x:95, y: 40};

    let intervalId;
    let gameSpeed = 100;

    let dx = cellSize;
    let dy = 0;


    const randomDirection = [-2.5, 1, 0, -1.5, 1.5, 0, 1, 2.5 , 3, 0, -3];

    const gameArena = document.getElementById("game-arena");

    function getRandomDirection(){
        return randomDirection[Math.floor(Math.random() * randomDirection.length)];
    }

    function resetGame(){
        
        const Start = document.querySelector("#start-btn");
        Start.style.display = 'block';
    
        gameRound = 5;
        leftPlayerScore = 0;
        rightPlayerScore = 0;
    
        ballPosition.x = 50;
        ballPosition.y = 50;
    
        leftBarPosition.x = 5;
        leftBarPosition.y = 40;
    
        rightBarPosition.x = 95;
        rightBarPosition.y = 40;
        // ballPosition = {x: 50, y: 50}
        // leftBarPosition = {x:5, y:42}
        // rightBarPosition = {x:95, y: 42};
    
        dx = cellSize;
        dy = 0;
    
        drawBallAndBar();
        updateScore();
    }
    function drawScoreBoard(){
        const drawScore = document.createElement("div");
        drawScore.id = 'score-board';
    
        const leftPlayerText = document.createElement("p");
        leftPlayerText.textContent = `left player score : ${leftPlayerScore}`;
        leftPlayerText.classList.add('score');
    
        const rightPlayerText = document.createElement("p");
        rightPlayerText.textContent = `right player score : ${rightPlayerScore}`;
        rightPlayerText.classList.add('score');
    
        drawScore.appendChild(leftPlayerText);
        drawScore.appendChild(rightPlayerText);
    
        document.body.insertBefore(drawScore, gameArena);
    }

    function updateScore(){
        const scoreElement = document.getElementsByClassName('score');
    
        scoreElement[0].textContent = `left player score ${leftPlayerScore}`;
        scoreElement[1].textContent = `righht player score ${rightPlayerScore}`;
    }
    
    function barPositionSetting(e, bar, barPosition){
        if(e.key === "ArrowUp"){
            barPosition.y = Math.max(0, barPosition.y - cellSize);
        }
        else if(e.key === "ArrowDown"){
            barPosition.y = Math.min(80, barPosition.y + cellSize);
        }
        bar.style.top = `${barPosition.y}%`
    }

    function moveBar(e){
        const bar = document.getElementsByClassName("bar");
        const leftBar = bar[0];
        const rightBar = bar[1];
    
        if(rightBarMoves){
            barPositionSetting(e, rightBar, rightBarPosition);
        }
        else{
            barPositionSetting(e, leftBar, leftBarPosition);
        }
    }

    function drawDiv(x, y, className){
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}%`;
        divElement.style.left = `${x}%`;
        return divElement;
    }

    function drawBallAndBar(){
        gameArena.innerHTML = '';
    
        const leftBars = drawDiv(leftBarPosition.x, leftBarPosition.y, 'bar');
        gameArena.appendChild(leftBars);
    
        const rightBars = drawDiv(rightBarPosition.x, rightBarPosition.y, 'bar');
        gameArena.appendChild(rightBars);
    
        const ballDiv = drawDiv(ballPosition.x, ballPosition.y, 'ball');
        gameArena.appendChild(ballDiv)
    
    
    }

    function moveBall(){
        ballPosition.x += dx;
        ballPosition.y += dy;
    
    }
    function isBallHitting(){
        const rightWall = ballPosition.x >= 100 - cellSize;
        const leftWall = ballPosition.x <= 0;
        const topWall = ballPosition.y <= 0;
        const bottomWall = ballPosition.y >= 100 - cellSize;

        return {rightWall, leftWall, topWall, bottomWall};
    }

    function isBallHittingLeftBar(){
        const leftBar = (leftBarPosition.x === ballPosition.x) && (leftBarPosition.y <= ballPosition.y) && (ballPosition.y <= leftBarPosition.y + barHeight);

        return leftBar;
    }

    function isBallHittingRightBar(){
        const rightBar = (rightBarPosition.x === ballPosition.x + ballSize) &&  (rightBarPosition.y <= ballPosition.y) && (ballPosition.y <= rightBarPosition.y + barHeight);
        
        return rightBar;
    }

function runAgain(bar){

    if(gameRound === 0){
        clearInterval(intervalId);
        alert(`game over '\n' ${leftPlayerScore > rightPlayerScore ? 'Left' : 'Right'} player win the game by ${Math.abs(leftPlayerScore - rightPlayerScore)} Points`)
        gameStart = false;
        resetGame();
        return;
    }

    setTimeout(() => {
        if(bar === 'rightBar'){

            // rightBarPosition.x = 95;
            // rightBarPosition.y = 40;
             // ballPosition.x = 90;
            // ballPosition.y = 50;
            rightBarPosition = {x:95, y: 42};
            ballPosition = {x: 90, y: 50}
        }
        else{
            leftBarPosition = {x:5, y:42}//check later
            ballPosition = {x: 5, y: 50}
            // leftBarPosition.x = 5;
            // leftBarPosition.y = 40;
            // ballPosition.x = 5;
            // ballPosition.y = 50;
        }

        gameLoop();

    }, gameRoundIntervel);
}


function gameLoop(){
    intervalId = setInterval(() => {
        const {rightWall, leftWall, topWall, bottomWall} = isBallHitting();

        if(isBallHittingLeftBar()){
            
            rightBarMoves = true;
            leftBarMoves = false;

            dx = cellSize; //change direction horizontal 
            dy = getRandomDirection();//random vertical direction
        }

        if(isBallHittingRightBar()){
            rightBarMoves = false;
            leftBarMoves = true;

            dx = -cellSize;
            dy = getRandomDirection();
        }

        if(topWall || bottomWall){
            dy = -dy;
        }

        if(rightWall){
            leftPlayerScore += score;
            updateScore();
            clearInterval(intervalId);
            gameRound--;
            runAgain('rightBar');
            return;
        }
        if(leftWall){
            rightPlayerScore += score;
            updateScore();
            clearInterval(intervalId);
            gameRound--;
            runAgain('leftBar');
            return;
        }
        moveBall();
        drawBallAndBar();

    }, gameSpeed)
}



function runGame(){
    if(!gameStart){
        gameStart = true;

        document.addEventListener("keydown", moveBar);

        const roundElement = document.getElementById('round');
        gameRound = isNaN(Number(roundElement.value)) ? 5 : Number(roundElement.value);
        // gameRound = Number(roundElement.value) || 5; // Default to 5 if invalid input

        gameLoop();
    }
}


function initiatGame(){
    drawScoreBoard();
    drawBallAndBar();


    const Start  = document.createElement('button');
    Start.id = "start-btn"
    //Start.classList.add("start-button")
    Start.textContent = "Start";
    document.body.appendChild(Start);

    Start.addEventListener("click", function startGame(){
        Start.style.display = "none";
        runGame();
    })
}

initiatGame();

})