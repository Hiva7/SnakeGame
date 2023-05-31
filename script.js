class Snake{
    constructor(x, y){
        this.x=x;
        this.y=y;
    }
}

const canvas=document.getElementById("myCanvas");
const ctx=canvas.getContext("2d");
const myWidth=canvas.offsetWidth;
const myHeight=canvas.offsetHeight;

const width_size=10
const height_size=width_size/2;
const arr_size=900;
const grid_size=Math.sqrt(arr_size);

let x;
let y;
let rear;
let front;
let direction
let speed;
let snake=new Array(arr_size);
let food=new Array(2);
let score;
let animation;
let over;
let move_interval;

const snake_color="lime";
const snake_border="#4D4D4D";
const grid_color="white";
const grid_border=snake_border;
const food_color="red";
const food_border=snake_border;
ctx.lineWidth=1;

function start(){
    speed=document.getElementById('mySelect').value;
    cooldown=false;
    over=false;
    document.getElementById('score').innerHTML=0;
    score=0;
    rear=0;
    front=3;
    direction=0;
    x=width_size*6;
    y=height_size*6;
    for(let i=0; i<arr_size; i++){
        snake[i]=new Snake(0, 0);
    }
    for(let i=rear; i<front; i++){
        snake[i].x=x;
        snake[i].y=y;
        x+=width_size;
    }
    randomizeFood();
    animate();
    move_interval=setInterval(move, speed);
    document.getElementById('startGame').style.display="none";
    document.getElementById('level').style.display="none";
}

function animate(){
    ctx.clearRect(0, 0, myWidth, myHeight);
    draw_grid();
    draw_snake();
    draw_food();
    
    animation=requestAnimationFrame(animate);
}
function draw_snake(){
    ctx.fillStyle=snake_color;
    ctx.strokeStyle=snake_border;
    if(front>rear){
        for(let i=rear; i<front; i++){      
            ctx.fillRect(snake[i].x, snake[i].y, width_size, height_size);
            ctx.strokeRect(snake[i].x, snake[i].y, width_size, height_size);
        }
    }
    else{
        for(let i=rear; i<arr_size; i++){
            ctx.fillRect(snake[i].x, snake[i].y, width_size, height_size);
            ctx.strokeRect(snake[i].x, snake[i].y, width_size, height_size);
        }
        for(let i=0; i<front; i++){
            ctx.fillRect(snake[i].x, snake[i].y, width_size, height_size);
            ctx.strokeRect(snake[i].x, snake[i].y, width_size, height_size);
        }
    }
}
function draw_grid(){
    ctx.fillStyle=grid_color;
    ctx.strokeStyle=grid_border;
    for(let i=0; i<=myWidth; i+=width_size){
        for(let j=0; j<=myHeight; j+=height_size){
            ctx.fillRect(i, j, width_size, height_size);
            ctx.strokeRect(i, j, width_size, height_size);
        }
    }
}


function getRandomInt(min, max) {
    min=Math.ceil(min);
    max=Math.floor(max);
    return Math.floor(Math.random()*(max-min)+min);
}

function draw_food(){
    ctx.fillStyle=food_color;
    ctx.strokeStyle=food_border;
    ctx.fillRect(food[0], food[1], width_size, height_size);
    ctx.strokeRect(food[0], food[1], width_size, height_size);
}
function randomizeFood(){
    food[0]=getRandomInt(0, grid_size)*width_size;
    food[1]=getRandomInt(0, grid_size)*height_size;
}
function randomizeFood_check(){
    if(front>rear){
        for(let i=rear; i<front; i++){      
            if(food[0]==snake[i].x){
                if(food[1]==snake[i].y){
                    return false;
                }
            }
        }
    }
    else{
        for(let i=rear; i<arr_size; i++){
            if(food[0]==snake[i].x){
                if(food[1]==snake[i].y){
                    return false;
                }
            }
        }
        for(let i=0; i<front; i++){
            if(food[0]==snake[i].x){
                if(food[1]==snake[i].y){
                    return false;
                }
            }
        }
    }
    return true;
}
function eatFood(){
    score+=getRandomInt(1, (140-speed)/10)*Math.abs(front-rear);
    document.getElementById('score').innerHTML=score;
    rear--;
    randomizeFood();
    while(randomizeFood_check()==false){
        randomizeFood();
    }
}

function move(){
    const startTime=performance.now();
    update();
    if(direction!=0){
        snake[front].x=x;
        snake[front].y=y;
        if(direction==1){
            x-=width_size;
        }
        else if(direction==2){
            y-=height_size;
        }
        else if(direction==3){
            x+=width_size;
        }
        else if(direction==4){
            y+=height_size;
        }
        if(gameOver_check()==true){
            gameOver();
            return;
        }
        if(snake[front].x==food[0]&&snake[front].y==food[1]){    
            eatFood();
        }
        front++;
        rear++;
        if(front==arr_size){
            front=0;
        }
        if(rear==arr_size){
            rear=0;
        }
    }
    const endTime=performance.now();
    console.log(endTime-startTime);
}

function gameOver_check(){
    for(let i=rear; i<front-1; i++){
        if(snake[front].x==snake[i].x&&snake[front].y==snake[i].y){
           return true; 
        }
    }
    if(snake[front].x>=width_size*grid_size||snake[front].y>=height_size*grid_size){
        return true;
    }
    if(snake[front].x<0||snake[front].y<0){
        return true;
    }
    return false;
}
function gameOver(){
    direction=0;
    over=true;
    cancelAnimationFrame(animation);
    clearInterval(move_interval);
    document.getElementById('startGame').style.display="block";
    document.getElementById('level').style.display="block";
}

var keyBuffer=[];
function keyDown(e){
    var keyCode=e.which?e.which:e.keyCode;
    if(keyCode>=37&&keyCode<=40&&keyCode!==keyBuffer[keyBuffer.length-1]){
        keyBuffer.push(keyCode);
    }
    if(keyCode===13&&over){
        start();
    }
};
document.addEventListener('keydown', keyDown);
function update(){
    var key=keyBuffer.shift();
    if(direction!=3&&key===37&&direction!=0){
        direction=1;
    } 
    else if(direction!=1&&key===39){
        direction=3;
    }
    else if(direction!=4&&key===38){
        direction=2;
    }
    else if(direction!=2&&key===40){
        direction=4;
    }
};


document.getElementById('mySelect').value=90;



