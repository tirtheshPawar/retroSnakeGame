const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById('logo');
const score = document.getElementById('score')
const highScoreText= document.getElementById('highScore')
// Defining game variables
let snake = [{x: 10, y:10}]; //object stored inside array, x&y coords defining 10,10 middle of the board starting position
const gridSize = 20;
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draws game map, snake and food, update score
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Creates the snake on the board 
function drawSnake(){
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

// Creating a snake or food cube/div
// tag - is the div passed when we called the function above and className is snake
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className; //className is the name of the class that we have passed in the function here and it matches the element property too 
    return element;
}

// sets position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x; //using setPosition and snakeElement (div) which we are sending here
    element.style.gridRow = position.y;

}

// Testing draw function 
// draw();

// Draw food
function drawFood(){
    if (gameStarted){
    const foodElement = createGameElement('div','food');
    setPosition(foodElement, food)
    board.appendChild(foodElement);
}
}

// Generates food on the map on a random position every time
function generateFood(){
    //Math.floor to round the values and +1 is added to avoid 0 coords
    const x = Math.floor(Math.random() * gridSize) +1;
    const y = Math.floor(Math.random() * gridSize) +1;
    return{x,y};
}

// For the snake movement
function move(){
    const head = {...snake[0]}; //created shallow copy of the head's origin using spread operator 
    switch (direction) {
        case 'right': 
            head.x++; 
            break;
        case 'left': 
            head.x--; 
            break;
        case 'up': 
            head.y--; 
            break;
        case 'down': 
            head.y++; 
            break;
    }

    snake.unshift(head); //adds a head object to the beginning of the snake array, const head will be added to the top of the array each time the position changes
    // snake.pop();
    if(head.x === food.x && head.y === food.y){
        food = generateFood(); // Since we have run into the food we need new food on the map now
        increaseSpeed();
        clearInterval(gameInterval); //Resetting movement (move) function
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    }else{
        snake.pop(); // main method contributing to the increase or decrease of the snake size. So if snake doesnt run into food then pop the tail (remove) hence it is placed in else
    }
}

// test moving
// setInterval(()=>{
//     move();
//     draw();
// },200)

function startGame(){
    gameStarted = true; //Keeping track of the running game  
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//Event listener for key press
function handleKeyPress(event){
    if(
    (!gameStarted && event.code === "Space" )||
    (!gameStarted && event.key === " " )) //handling for every other browser
    {
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress)

function increaseSpeed(){
// console.log(gameSpeedDelay);
if(gameSpeedDelay>150){
gameSpeedDelay -= 5;
}
else if (gameSpeedDelay > 100) {
gameSpeedDelay -= 3; //decreases the speed getting faster
}
else if (gameSpeedDelay > 50) {
gameSpeedDelay -= 2; //decreases the speed getting faster
}
else if (gameSpeedDelay > 25) {
gameSpeedDelay -= 1; //decreases the speed getting faster
}
}

function checkCollision(){
    const head = snake[0];

    // setting boundaries for the snake using coordinates and gridsize
    if(head.x <1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    // Checking if the snake hits itself
    for (let i =1; i<snake.length; i++){
        // if the head is in the same position as the body in the ith position
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0'); //adds padding of zeroes if the score is less than 3 digits
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block'; //since it was hidden before
    logo.style.display = 'block'; //since it was hidden before
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,0);
    }
    highScoreText.style.display='block';
}