const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById('logo');

// Defining game variables
let snake = [{x: 10, y:10}]; //object stored inside array, x&y coords defining 10,10 middle of the board starting position
const gridSize = 20;
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draws game map, snake and food
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
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
    const foodElement = createGameElement('div','food');
    setPosition(foodElement, food)
    board.appendChild(foodElement);
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
        clearInterval(); //Resetting movement (move) function
        gameInterval = setInterval(()=>{
            move();
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
        // checkCollision();
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