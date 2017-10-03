//getting anchor point from html
var canvas = document.getElementById('canvas');
var button = document.getElementById('pump');
var collect = document.getElementById('collect');
var collectCounter = document.getElementById('collect-counter');
var balloonCounter = document.getElementById('balloon-counter');
var counterDiv = document.getElementById('counter');

//start canvas API
var ctx = canvas.getContext('2d');

//setup stats for game
var balloonCount = 5;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var DEFAULTX = 50;
var DEFAULTY = 75;
var currentX = DEFAULTX;
var currentY = DEFAULTY;
var offset = 0;
var counter = 0;
var moneyCollected= 0;

//functions
function balloonBody(x, y, offsetY){
  ctx.beginPath();
  ctx.fillStyle = "gold";
  ctx.strokeStyle = "gold";
  offsetY = offsetY || 0;
  ctx.ellipse(centerX, centerY - offsetY, x, y, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function balloonKnot(x, y){
  ctx.beginPath();
  ctx.fillStyle = "gold";
  ctx.strokeStyle= "gold";
  ctx.moveTo(centerX, centerY + y);
  ctx.lineTo(centerX + 20, centerY + y + 20);
  ctx.lineTo(centerX - 20, centerY + y + 20);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function createBalloon(x,y){
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
  collectCounter.innerText = '₪ ' + moneyCollected + ' Collected';
}

function balloonLeft(){
  if(balloonCount > 0)
    balloonCounter.innerText = balloonCount + ' Balloons left';
  else
    balloonCounter.innerText = 'Game Finished';
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
    if(currentX > 60){
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
