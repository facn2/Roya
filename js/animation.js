var ellipse;
var button = document.getElementsByTagName('button')[0];
var svg = document.getElementsByTagName('svg')[0];
var poly = document.getElementsByTagName('polygon')[0];
var pop = document.getElementById('pop');
var DEFAULTX = 50;
var DEFAULTY = 70;

var currentX = DEFAULTX;
var currentY = DEFAULTY;
var balloonWidth;
var currentCY, currentCX, DEFAULTCY;

function createBalloon(){
  ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
  console.log(svg.firstChild);
  svg.replaceChild(ellipse, svg.firstChild);
  ellipse.setAttribute('rx', DEFAULTX);
  ellipse.setAttribute('ry', DEFAULTY);
  ellipse.setAttribute('cy', DEFAULTCY);
  ellipse.setAttribute('cx', currentCX);
  ellipse.setAttribute('fill', 'gold');
}

window.onload = ()=>{
  svg.setAttribute('width', window.innerWidth * 0.8);
  svg.setAttribute('height', window.innerHeight * 0.8);
  currentCY = svg.height.baseVal.value * 0.5;
  currentCX = svg.width.baseVal.value * 0.5;
  DEFAULTCY = currentCY;
  createBalloon();
  poly.setAttribute('points', '' + currentCX + ',' + (currentCY + currentY)
  +' '+(currentCX +20)+','+(currentCY + currentY+ 20)
  +' ' +(currentCX -20)+','+(currentCY + currentY+ 20));
}

function popAnimation(){
  poly.classList.remove('disappear');
  // console.log(ellipse);
  pop.classList.add('disappear');
}


button.addEventListener('click', e => {
  ellipse.setAttribute('rx', currentX+=10);
  ellipse.setAttribute('ry', currentY+=10);
  ellipse.setAttribute('cy', currentCY-=10);
  balloonWidth = ellipse.getAttribute("rx");
  console.log(balloonWidth);
  if(balloonWidth > 100){
    console.log('inside if', balloonWidth);
    poly.classList.add('disappear');
    ellipse.classList.add('disappear');
    pop.classList.remove('disappear');
    setTimeout(popAnimation.bind(ellipse),500);
    balloonWidth = DEFAULTX;
    createBalloon();
    // ellipse.setAttribute('rx', DEFAULTX);
    // ellipse.setAttribute('ry', DEFAULTY);
    ellipse.setAttribute('cy', DEFAULTCY);
  }

});
