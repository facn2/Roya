//select DOM elements
var numOfMoves = document.getElementById('num');
var success = document.getElementById('success-container');
var invalid = document.getElementsByClassName('invalid')[0];
//logic part
var pop = false; // global state

var moves = 0;
//make 3 poles
var poppedDisk;
var pole1 = [1,2,3];
var pole2 = [];
var pole3 = [];

function popAndGet(pole){
  if(!pop && pole.length){
    poppedDisk = pole.pop();
    pop = !pop;
  }
  else if(poppedDisk && (!pole.length || (poppedDisk > pole[pole.length - 1]))){
    pole.push(poppedDisk);
    poppedDisk = null;
    pop = !pop;
    moves++;
    num.innerText = moves;
  }
  else
    invalid.classList.remove('hidden');
}


//canvas parts
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var p1p2 = width * 0.33;
var p2p3 = width * 0.66;

//metrics for block and poles
var bHeight = 50;
var pLength = height * 0.7;
var pWidth = width * 0.02;
var p1X = p1p2 / 2 - pWidth / 2,
    p2X = (p2p3 - p1p2) / 2 - pWidth / 2 + p1p2,
    p3X = (width - p2p3) / 2 - pWidth / 2  + p2p3;
var py = 100;
var bY = py + pLength;

function Shape(x, y, w, h, fill){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.fill = fill;
}

Shape.prototype.draw = function(){
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

function Pole(x, y){
  Shape.call(this, x, y);
  this.w = pWidth;
  this.h = pLength;
  this.fill = 'black';
}

Pole.prototype = Object.create(Shape.prototype);

Pole.prototype.constructor = Pole;

Pole.prototype.draw = function(){
  Shape.prototype.draw.call(this);
}

var p1 = new Pole(p1X, py);
var p2 = new Pole(p2X, py);
var p3 = new Pole(p3X, py);

function drawPole(){
  p1.draw();
  p2.draw();
  p3.draw();
}

function blocksToDraw(block, i, x, y){
  if(block === 1)
  return function(){
    new Shape(x + pWidth / 2 - 70, y - bHeight * (i + 1), 140, bHeight, 'rgba(61, 114, 232, .5)').draw();
  };
  else if(block === 2)
  return function(){
    new Shape(x + pWidth / 2 - 60, y - bHeight * (i + 1), 120, bHeight, 'rgba(20, 217, 94, .5)').draw();
  };
  else if(block === 3)
  return function(){
    new Shape(x + pWidth / 2 - 50, y - bHeight * (i + 1), 100, bHeight, 'rgba(231, 82, 82, .5)').draw();
  };
}



function drawStack(stack, x){
  if(poppedDisk)
    blocksToDraw(poppedDisk, 0, width / 2, bHeight + 40)();
  stack.map(function(block, i){
    blocksToDraw(block, i, x, bY)();
  });
}

function redraw(){
  //clear previous stuff
  ctx.clearRect(1, 1, width - 2, height - 2);
  //loop all three poles
  drawPole();
  if(pole1.length)
    drawStack(pole1, p1X);
  if(pole2.length)
    drawStack(pole2, p2X);
  if(pole3.length)
    drawStack(pole3, p3X);
}

//initial state
redraw();
numOfMoves.innerText = moves;

ctx.strokeRect(0, 0, canvas.width, canvas.height);
canvas.addEventListener('click', function(e){
  var mx = e.offsetX; // layerX in firefox? needs checking for browser compatibility
  var my = e.offsetY;

  if(!invalid.getAttribute('hidden'))
    invalid.classList.add('hidden');

  if(mx <= p1p2){
    popAndGet(pole1);
    redraw();
    console.log('p1');
  }
  else if (mx < p2p3 && mx > p1p2){
    popAndGet(pole2);
    redraw();
    console.log('p2');
  }
  else if (mx >= p2p3){
    popAndGet(pole3);
    redraw();
    if(pole3.length === 3)
      success.classList.remove('hidden');
  }
});
