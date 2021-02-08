//Create variables here
var  dog, happyDog, database, foodS, foodStock,dogImg1,dogImg2;
var feed,addFood,fedTime,lastFed,foodObj;
var gameState,readState,garden,washroom,database,bedroom;
function preload()
{
  //load images here
  dogImg1=loadImage("images/virtual pet images/dogImg.png")
  dogImg2=loadImage("images/virtual pet images/dogImg1.png")
  garden=loadImage("images/virtual pet images/Garden.png");
washroom=loadImage("images/virtual pet images/Wash Room.png");
bedroom=loadImage("images/virtual pet images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);
  
  dog=createSprite(250,250,20,20)
  dog.addImage(dogImg2)
  dog.scale=0.3
  foodObj=new Food()
  foodStock=database.ref('Food')
  foodStock.on("value",readStock)
  feed=createButton("Feed the dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)
  addFood=createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
  lastFed=data.val()
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
})
}

function draw() {  
background(46,139,87);


  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg1);
  }

 drawSprites();
}
function readStock(data){
foodS=data.val()
foodObj.updateFoodStock(foodS)

}



function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}
function feedDog(){
  dog.addImage(dogImg1)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
