
// the snake is divided into small segments, which are drawn and edited on each 'draw' call
let numSegments = 10;
let direction = 'right';

const xStart = 0; //starting x coordinate for snake
const yStart = 250; //starting y coordinate for snake
const diff = 20;

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;

let scoreBoard = document.getElementById('scoreBoard');
let score = 0;

let running = true;

let frames = 20;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(frames);
  stroke(255);
  strokeWeight(20);
  updateFruitCoordinates();

  for (let i = 0; i < numSegments; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  } 
}

function draw() {
  background(0);

  stroke("lightgreen");
    
  for (let i = 0; i < numSegments - 2; i++) {
    line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
  }

  

  stroke("red");
  point(xFruit, yFruit);

  if (running) {    
    updateSnakeCoordinates();
    checkGameStatus();
    checkForFruit();
    frameRate(frames);
  } 
}

/*
 The segments are updated based on the direction of the snake.
 All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 and this results in the movement of the snake.

 The last segment is added based on the direction in which the snake is going,
 if it's going left or right, the last segment's x coordinate is increased by a
 predefined value 'diff' than its second to last segment. And if it's going up
 or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {
  for (let i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

/*
 I always check the snake's head position xCor[xCor.length - 1] and
 yCor[yCor.length - 1] to see if it touches the game's boundaries
 or if the snake hits itself.
*/
function checkGameStatus() {
  if (!running) return;
  if (
    xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1]< 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0 ||
    checkSnakeCollision()
  ) {
    running = false;
    scoreBoard.style.color = "red";
    scoreBoard.innerHTML = "Game over, your score is: " + score;
    frameRate(20);
    score = 0;
  }
}

/*
 If the snake hits itself, that means the snake head's (x,y) coordinate
 has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
  if (!running) return;
  const snakeHeadX = xCor[xCor.length - 1];
  const snakeHeadY = yCor[yCor.length - 1];
  for (let i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

/*
 Whenever the snake consumes a fruit, I increment the number of segments,
 and just insert the tail segment again at the start of the array (basically
 I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
    if (dist(xCor[xCor.length - 1], yCor[yCor.length - 1], xFruit, yFruit) <= diff) {
        scoreBoard.innerHTML = "Score: " + (++score);
        xCor.unshift(xCor[0]);
        yCor.unshift(yCor[0]);
        numSegments++;
        frames += 5;
        updateFruitCoordinates();
    }
}

function updateFruitCoordinates() {
  /*
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
  */

  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}

function keyPressed() {
  switch (keyCode) {
    case 37:
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 39:
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case 38:
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 40:
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case 82:
      xCor = [];
      yCor = [];


      numSegments = 10;

      for (let i = 0; i < numSegments; i++) {
        xCor.push(xStart + i * diff);
        yCor.push(yStart);
      } 

      score = 0;
      scoreBoard.style.color = "white";
      scoreBoard.innerHTML = "Score: " + score;
      running = true;
      frames = 20;
      
      frameRate(20);
      updateFruitCoordinates();
      break;
  }
}

window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);
