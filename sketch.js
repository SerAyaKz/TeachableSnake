let video;
let flipVideo;
let label = "waiting...";

let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/paste here/';

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

let snake;
let rez = 40;
let food;
let w;
let h;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(160, 120); 
  video.hide();
  flipVideo = ml5.flipImage(video);
  classifyVideo(); 

  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();
}

function classifyVideo() {
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, gotResults);
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function controlSnake() {
  if (label === "left") {
    snake.setDir(-1, 0);
  } else if (label === "right") {
    snake.setDir(1, 0);
  } else if (label === "down") {
    snake.setDir(0, 1);
  } else if (label === "up") {
    snake.setDir(0, -1);
  }
}

function draw() {
  //background(220);

  if (snake.eat(food)) {
    foodLocation();
  }

  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x * rez, food.y * rez, rez, rez); 

  image(flipVideo, width - 160, 0, 160, 120);

  textSize(32);
  fill(255);
  text(label, 10, 50);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  controlSnake();
  classifyVideo();
}
