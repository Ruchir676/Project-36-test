var dog, dogImage, happyDog, database, foods, foodStock;

var addButton, feedButton;
var fedTime, lastFed;

var foodObj;

function preload()
{
  dogImage = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(900, 500);
  
  dog = createSprite(800,200);
  dog.addImage(dogImage);
  dog.scale=0.15;

  database = firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  feedButton = createButton("Feed the dog");
  feedButton.position(700,95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Add Food");
  addButton.position(800,95);
  addButton.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

  drawSprites();

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed : "+lastFed%12+ " PM",350,30);
  } else if(lastFed === 0) {
    text("Last Feed : 12 AM",350,30);
  } else {
    text("Last Feed : "+lastFed + " AM",350,30);
  }
}


function readStock(data) {
  foods=data.val();
}

function writeStock(x) {
  if(x<=0) {
    x=0;
  } else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour() 
  })
}

function addFoods() {
  foods++;
  database.ref('/').update({
    Food:foods
  })
}

