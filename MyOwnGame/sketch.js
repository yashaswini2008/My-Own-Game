var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;


var girl, girlRunning, girlCollided;
var ground;

var obstaclesGroup;

var score = 0;
var gameoverImg,restartImg,book1Img,book2Img,appleImg,g1Img,g2Img,g3Img,g4Img,g5Img,g6Img,g7Img,medicineImg,milkImg,ob1Img,ob2Img,ob3Img,ob4Img,orangeImg,schoolImg,watermelonImg;
var jumpSound , checkPointSound, dieSound, bgSound;

function preload(){
  //loading animations for girl
  girlRunning = loadAnimation ("g1.png","g2.png","g3.png","g4.png","g5.png","g6.png","g7.png")

  girlCollided = loadAnimation("ob1.png","ob2.png","ob3.png","ob4.png");
  
  treeImg= loadImage('image/tree.png')
  bgImg= loadImage('Forest1.jpg')
  
  obstacle = loadAnimation("ob1.png");
  obstacle = loadAnimation("ob2.png");
  obstacle = loadAnimation("ob3.png");
  obstacle = loadAnimation("ob4.png");


  restartImg = loadImage("image/reset.png");
  gameoverImg = loadAnimation("image/over.png");
  endImage=loadAnimation("image/end.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("gameover.mp3")
  checkPointSound = loadSound("gamend.mp3")
  bgSound= loadSound("bgm.mp3")

}

function setup() {
  createCanvas(1200,500);
  // creating girl 
  girl = createSprite(100,250,10,10);
  girl.addAnimation("running", girlRunning);
  girl.addAnimation("collided", girlCollided);
  girl.setCollider("rectangle",0,0,150,250);
  girl.scale = 0.9;
  

  ground = createSprite(width/2,height-20,width*100,10);
  ground.visible= false;
  
  gameover = createSprite(width/2-50,height/2,200,200);
  gameover.addAnimation("Over",gameoverImg);
  gameover.scale = 1;
  
  restart = createSprite(camera.position.x -100,100);
  restart.addImage(restartImg);
  restart.debug = false;
  restart.scale = 0.5;
  
  end = createSprite(600,200);
  end.addAnimation("the end",endImage);
  end.scale=1.5;

  
  bgSound.loop()


  obstaclesGroup = createGroup();
 lampGroup = createGroup();
  
  score = 0;

 
}

function draw() {
  
  background(bgImg);  

  camera.position.x = girl.x;

  console.log(girl.x);

 ground.x=camera.position.x;
  ground.x=camera.position.x;



  end.x=camera.position.x;
  restart.x=camera.position.x-500;
  gameover.x=camera.position.x-25;

  //displaying score
  fill("white")
  textFont("copperplate gothic");
  textSize(25);
  text("YOUR SCORE: "+ score,camera.position.x-350,28);

  
  
  if(gameState === PLAY){

    gameover.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring
    score = score + Math.round(getFrameRate()/160);
    
  
    

    //jump when the space key is pressed
    if(keyDown("RIGHT_ARROW")) {
      girl.velocityY = -20;
       // jumpSound.play();
    }

    if(keyDown(RIGHT_ARROW)){
      girl.x= girl.x+20;
      score++
     
    }
    
    //add gravity
    girl.velocityY = girl.velocityY + 1.0
  
    //spawn the lamps
    spawnlamps();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(girl)){
        
        gameState = END;
        dieSound.play();
    }

    if(girl.x>9990){
      gameState=Over;
      checkPointSound.play()
    }

  }
   else if (gameState === END) {
      gameover.visible = true;
      restart.visible = true;
     
     girl.changeAnimation("collided", girlCollided);
    girl.scale=0.5
     girl.velocityY = 0
     girl.velocityX=0;
      ground.velocityX=0;
     
    
    obstaclesGroup.setLifetimeEach(-1);
    lampGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     lampGroup.setVelocityXEach(0); 

   }else if(gameState===Over){
   
    obstaclesGroup.destroyEach();
    lampGroup.destroyEach();
    girl.destroy();
    fort.destroy();
    end.visible=true;
    bgSound.stop()
   }

   

  girl.collide(ground);
  
  if(mousePressedOver(restart)) {
      reset();
    }


    drawSprites();    
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  lampGroup.destroyEach();
  girl.changeAnimation("running",girlRunning);
  score=0;
  girl.x=0;
  girl.scale=0.5

}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(camera.position.x +800,410,10,40);
   obstacle.velocityX =0;
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("ob1",ob1Img);
              obstacle.scale = 0.4;
              break;
      case 2: obstacle.addAnimation("ob2",ob2Img);
              obstacle.scale=1.5
              break;
      
      default: break;
    }
   
         
    
    obstacle.lifetime = 800;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnlamps() {
  //write code here to spawn the lamps and trees
  if (frameCount % 160 === 0) {
    var lamp = createSprite(camera.position.x+Math.round(random(850,1000)),350,40,10);
   
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: lamp.addImage(lampImg);
              lamp.scale = 0.5;
              break;
      case 2: lamp.addImage(treeImg)
             lamp.scale= 0.93
              break;
      
      default: break;
    }
    
    lamp.velocityX = 0;
    
    
    //adjust the depth
    lamp.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    lampGroup.add(lamp);
  }
}

