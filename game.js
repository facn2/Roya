//getting anchor point from html
var canvas = document.getElementById('canvas');
var button = document.getElementById('pump');
var collect = document.getElementById('collect');
var collectCounter = document.getElementById('collect-counter');
var balloonCounter = document.getElementById('balloon-counter');
var counterDiv = document.getElementById('counter');
var gameOver = document.getElementById('overlay');

//start canvas API
var ctx = canvas.getContext('2d');

//setup stats for game
var randomColor = 'gold';
var colorChart = ['gold', 'red', 'blue']; //color should relate to breaking point of balloon
var balloonCount = 2;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var DEFAULTX = 50;
var DEFAULTY = 75;
var currentX = DEFAULTX;
var currentY = DEFAULTY;
var offset = 0;
var counter = 0;
var moneyCollected= 0;
var breakPoint = 60;

//functions
function balloonBody(x, y, offsetY){
  ctx.beginPath();
  ctx.fillStyle = randomColor;
  ctx.strokeStyle = randomColor;
  offsetY = offsetY || 0;
  ctx.ellipse(centerX, centerY - offsetY, x, y, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function balloonKnot(x, y){
  ctx.beginPath();
  ctx.fillStyle = randomColor;
  ctx.strokeStyle = randomColor;
  ctx.moveTo(centerX, centerY + y);
  ctx.lineTo(centerX + 20, centerY + y + 20);
  ctx.lineTo(centerX - 20, centerY + y + 20);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function randomizer(num){
  return Math.floor(Math.random() * num);
}

function colorPick(){ //yeah, we know having side effect to change global variable is not ideal
  var pickColor = randomizer(3);
  var result = pickColor===3?2:pickColor;
  switch (colorChart[result]) {
    case 'gold':
      breakPoint = randomizer(10) + 110;
      break;
    case 'red':
      breakPoint = randomizer(70) + 50;
      break;
    default:
      breakPoint = randomizer(20) + 50;
  }
  return result;
}

function createBalloon(x,y){
  randomColor = colorChart[colorPick()];
  balloonBody(x, y);
  balloonKnot(x, y);
}

function pumpingBalloon(x, y, offset){
  balloonBody(x, y, offset);
}

function boom(){
  ctx.font='48px serif';
  ctx.fillStyle='red';
  ctx.fillText('Boom', centerX - 50, centerY);
}

function cleanUp(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rounding(num){
  return Math.round(num * 10) / 10;
}

function countingMoney(){
  counterDiv.innerText = '₪ '+counter;
}

function countingMoneyCollected(){
  var display = window.location.href.includes('Ar')? ' المجموع':' Collected';
  collectCounter.innerText = '₪ ' + moneyCollected + display; // المجموع
}

function balloonLeft(){
  var display = window.location.href.includes('Ar')? ' عدد البالونات الباقي':' Balloons left';
  var finish = window.location.href.includes('Ar')? 'العبة انتهت':'Game Finished';
  if(balloonCount > 0)
    balloonCounter.innerText = balloonCount + display; // عدد البالونات الباقي
  else
    balloonCounter.innerText = finish; // العبة انتهت
}

function makeNewBalloon(){
  setTimeout(function(){
    cleanUp();
    button.disabled = true;
    setTimeout(function(){
      createBalloon(DEFAULTX, DEFAULTY);
      button.disabled = false;
    },200);
  },200);
}

function resetBalloonStats(){
  currentX = DEFAULTX;
  currentY = DEFAULTY;
  offset = 0;
  counter = 0;
  balloonCount -= 1;
  balloonLeft();
}

function pumpingStats(){
  currentX += 2;
  currentY += 2;
  offset += 2;
  counter += 0.1;
  counter = rounding(counter);
}

//start initial screen
countingMoney();
countingMoneyCollected();
balloonLeft();
createBalloon(DEFAULTX, DEFAULTY);

//listen to changes
button.addEventListener('click', function(){
  if(balloonCount > 0){
    pumpingStats();                               //should set pumping to
    countingMoney();                              //wait for new balloon
    pumpingBalloon(currentX, currentY, offset);   //but right now the timeinterval is so short is doesnt matter
    if(currentX > breakPoint){
      resetBalloonStats();
      countingMoney();
      cleanUp();
      boom();
      makeNewBalloon();
    }
  }
});

collect.addEventListener('click', function(){
  if(balloonCount > 0){
    makeNewBalloon();
    moneyCollected += counter;
    moneyCollected = rounding(moneyCollected);
    resetBalloonStats();
    countingMoney();
    countingMoneyCollected();
  }
});

//redirect to result page by making a pop up div
var balloonTimer = setInterval(function() {
  if(balloonCount == 0)
    gameEnd()
}, 500);

function gameEnd() {
  gameOver.style.visibility = 'visible';
};

function stopInterval() {
  clearInterval(balloonTimer);
};
