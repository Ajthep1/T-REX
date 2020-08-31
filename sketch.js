//let var const


const PLAY = 1;
const END = 0;
const START = -1;
var text1,text2,header;
var gameState = START;

var trex;
var ground;

var cloudsGroup;
var obstaclesGroup;
var score=0;

var input1,input2,submit;
var p , n;
var inc,inc2;

var s1,s2,s3;
var hs = 0;
var gameOver, restart;
var trexImage,groundImage,gameOverImage,restartImage,obstacle1,obstacle2
,obstacle4,obstacle5,obstacle6,cloudImage,trexCollided;
//load all the assets------ loadImage,loadAnimation,loadSound
function preload(){
    trexImage=loadAnimation("t1.png","t2.png","t3.png") ;
    groundImage=loadImage("ground2.png")
    gameOverImage = loadImage("gm.png");
    restartImage = loadImage("reset.png");
    obstcale1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    //obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    trexCollided = loadImage("trex_collided.png");  
   cloudImage=loadImage("cloud.png");
   s1 = loadSound("checkPoint.mp3");
   s2 = loadSound("jump.mp3");
   s3 = loadSound("die.mp3");
  }

function setup() {
  createCanvas(1200, 600);
  
  trex = createSprite(100,580,20,50);
  trex.addAnimation("running",trexImage);
  trex.addAnimation("collided",trexCollided);
  trex.scale = 0.5; 
  trex.visible = false
  ground = createSprite(600,580,1200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible = false;
  gameOver = createSprite(600,200);
  gameOver.addImage("gm",gameOverImage);
  gameOver.scale = 1.5;
  
  restart = createSprite(600,400);
  restart.addImage("r",restartImage);
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(600,590,1200,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  text1=createElement("h2")
  text2=createElement("h2")
  inc = createElement("h2")
  inc2 = createElement("h2")
  header = createElement("h1")
  input1=createInput("");
  input2 = createInput("");
  submit= createButton("PLAY");
  submit.size(100,30)
  
}

function draw() {
  //trex.debug = true;
  background(200);
  textSize(26)
  header.html("TREX RUNNER")
  
  header.position(50,30);
  text("Score: "+ score, 1050,80);
  //== and ===
  if(gameState==START){
    
    text1.html("Enter your Name")
    text2.html("Enter you Password")
 
    text1.position(300,175)
    text2.position(290,225)  
    input1.position(500,200)
    input2.position(500,250)
    submit.position(550,300)
    p=input2.value()
    n=input1.value() 
    text1.show()
      text2.show()
      input1.show()
      input2.show()
      submit.show()
      trex.visible = false
      ground.visible = false
    //inline function,arrow notation
   submit.mousePressed( ()=>{
    text1.hide()
    text2.hide()
    input1.hide()
    input2.hide()
    submit.hide()
    if(p === "pass" && n!="" )
    {
    gameState = PLAY;
    
    }
    else if(p!="pass" || n === "")
    {  
      text1.show()
      text2.show()
      input1.show()
      input2.show()
      submit.show()
      
      // 0-black, 255-white (0-255)
      //rgb (0 to 255,0 to255,0 to 255)
      //hexadecimal(0-9,A-F)  rgb ~ #22AF30"
     if(p!="pass"){
      inc.html("Incorrect password") 
      inc.position(500,400)
     }
     if(p === "pass")
     {
       inc.hide();
     }
     if(n === "")
     {
      inc2.html("Please Enter your username") 
      inc2.position(500,450) 
     }
    }

   } )
   


  }
  if (gameState===PLAY){
    inc.hide();
    inc2.hide();
    trex.visible = true;
    ground.visible = true;
    textSize(30)
    fill("black")
    text("Welcome "+n,50,120)
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   //console.log(trex.y)
    if(keyDown("space") && trex.y >= 538.1) {
      trex.velocityY = -16;
      s2.play();
    }
    if(score % 100 == 0 && score>0)
    {
      s1.play();
    }
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        s3.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.y=520
    //change the trex animation
    trex.changeAnimation("collided",trexCollided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
      
    }
    
  }
  text("High_Score: "+ hs, 950,120);
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 75 === 0) {
    var cloud = createSprite(1210,120,40,10);
    cloud.y = Math.round(random(80,220));
    cloud.addImage("cloud",cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -4;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(1210,565,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    var r=Math.round(random(1,6))
    switch(r)
    {
      case 1:
          obstacle.addImage("o1",obstacle1);
          break;
      case 2:
        obstacle.addImage("o2",obstacle2);
        break;
      case 3:
        obstacle.addImage("o4",obstacle4);
        break;
      case 4:
        obstacle.addImage("o4",obstacle4);
        break;
      case 5:
        obstacle.addImage("o5",obstacle5);
        break;
      case 6:
        obstacle.addImage("o6",obstacle6);  
        break;      

    }
   
    
    
    
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = START;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trexImage);
 
  if(score>hs)
  {
   hs = score;
  }
  score = 0;
  
}