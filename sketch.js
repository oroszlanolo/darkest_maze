//TODO: shop, upgrades
//TODO: collections
//TODO: pickable fuel
//TODO: power ups inside the rooms
//TODO: some kind of ending to the maze (maybe some reward)
//TODO: adjust numbers(energy usage, coin gain, coin number, speed, upgrade costs)

//TODO: Bottom GUI Graphical update
//TODO: Graphical update...

// maze: 796 * 532	-	18 * 12
// wall : 4
// space : 40 * 40
let canvasX;
let canvasY;
let mazeW;
let mazeH;
let mazeCols = 32;
let mazeRows = 24;
let wallW = 4;
let spaceW = 20;
let playerW = 16;
let simplicity = 20;
let roomNum = 0;

let mazeGenerator;

let myCanvas;
let guiH = 100;

let gameState;

let myPlayer;
let walls = [];
let coins = [];

let mazeImg;
let cirkImg;

let frcnt;

let gameSt = {
	MMenu : 0,
	Shop : 1,
	Upgrade : 2,
	Dungeon : 3,
	Settings : 4,
	KeyBind : 5
}

function preload(){
	loadJSON("upgrades.json",CBLoadUpgrades);
}

function setup() {
	// frameRate(30);
	mazeW = (spaceW + wallW) * mazeCols + wallW;
	mazeH = (spaceW + wallW) * mazeRows + wallW;
	myCanvas = createCanvas(mazeW,mazeH + guiH);
	myCanvas.parent("canvasD");
	canvasX = myCanvas.position().x;
	canvasY = myCanvas.position().y;
	mazeImg = createGraphics(mazeW,mazeH);
	myPlayer = new Player(wallW + playerW/2, wallW + playerW/2);
	loadCookies();
	createGUI();
	createCircle();
	frcnt = 0;
	// setInterval(frCount,1000);
	createWalls();
}


function newGame(){
	myPlayer.reset(wallW + playerW/2, wallW + playerW/2);
	createWalls();
}
function frCount(){
	print(frcnt);
	frcnt = 0;
}

function createWalls(){
	mazeGenerator = new MazeGenerator(mazeCols,mazeRows,wallW,spaceW,simplicity,10);
	setRooms();
	walls = mazeGenerator.makeNewMaze();
	coins = mazeGenerator.coins;
	updateMazePic();
}
function setRooms(){
	mazeGenerator.rooms = [];
	for(var i = 0; i < roomNum; i++){
		mazeGenerator.addRoom(floor(random(3,6.5)),floor(random(3,6.5)));
	}
}
function updateMazePic(){
	drawWalls();
	drawCoins();
}
function createCircle(){
	cirkImg = createGraphics(myPlayer.lightRange*2,myPlayer.lightRange*2);
	cirkImg.loadPixels();
	for(var i = -myPlayer.lightRange; i <= myPlayer.lightRange; i++){
		for(var j = -myPlayer.lightRange; j <= myPlayer.lightRange; j++){
			let brightness = map(sqrt(i*i + j*j), 0, myPlayer.lightRange, 0, 255);
			let ind = (cirkImg.width * (i + cirkImg.height / 2) + j + cirkImg.width/2) * 4;
			cirkImg.pixels[ind] = 0;
			cirkImg.pixels[ind + 1] = 0;
			cirkImg.pixels[ind + 2] = 0;
			cirkImg.pixels[ind + 3] = brightness;
		}
	}
	cirkImg.updatePixels();
}

function draw() {
	frcnt++;
	switch(gameState){
		case gameSt.MMenu:
			background(255);
			break;
		case gameSt.Shop:
			break;
		case gameSt.Upgrade:
			background(255);
			for(var ut of upgradeGUI){
				ut.draw();
			}
			break;
		case gameSt.KeyBind:
			background(255);
			for(var kt of keyBindGUI){
				kt.draw();
			}
			break;
		case gameSt.Dungeon:
			background(0);
			stroke(255,0,0);
			fill(255,0,0);
			drawLight(myPlayer.x,myPlayer.y,myPlayer.lightRange);
			myPlayer.move();
			reachCoin();
			myPlayer.draw();
			break;
	}
	drawGUI();
}

function reachCoin(){
	for(var c of coins){
		if(c.crash(myPlayer)){
			removeCoin(c);
			myPlayer.giveCoins(1);
		}
	}
}
function removeCoin(c){
	for(let i = 0; i < coins.length; i++){
		if(c.x == coins[i].x && c.y == coins[i].y){
			coins.splice(i,1);
			updateMazePic();
			return;
		}
	}
}

function drawLight(x,y,lightRange){
	image(mazeImg,0,0);
	var xPos = myPlayer.x-cirkImg.width/2;
	var yPos = myPlayer.y-cirkImg.height/2;
	image(cirkImg,xPos,yPos);
	fill(0);
	stroke(0);
	if(xPos > 0){
		rect(0,0,ceil(xPos),mazeH);
	}
	if(yPos > 0){
		rect(0,0,mazeW,ceil(yPos));
	}
	if(xPos+cirkImg.width < mazeW){
		rect(xPos+floor(cirkImg.width),0,mazeW,mazeH);
	}
	if(yPos+cirkImg.height < mazeH){
		rect(0,yPos+floor(cirkImg.height),mazeW,mazeH);
	}
}

function drawWalls(){
	mazeImg.background(255);
	for(var w of walls){
		if(w.destroyable){
			w.draw(mazeImg);
		}
	}
	for(var w of walls){
		if(!w.destroyable){
			w.draw(mazeImg);
		}
	}
}
function drawCoins(){
	for(var c of coins){
		c.draw(mazeImg);
	}
}

function keyPressed(){
	if(changingKey){
		changeKey(keyCode);
		changingKey = false;
		return false;
	}
	switch(keyCode){
		case keyPreference.UP.key:
			myPlayer.yDir ++;
			break;
		case keyPreference.RIGHT.key:
			myPlayer.xDir ++;
			break;
		case keyPreference.DOWN.key:
			myPlayer.yDir --;
			break;
		case keyPreference.LEFT.key:
			myPlayer.xDir --;
			break;
		case keyPreference.LUP.key:
			myPlayer.lightAdjust++;
			break;
		case keyPreference.LDOWN.key:
		myPlayer.lightAdjust--;
			break;
		case keyPreference.WALK.key:
			myPlayer.walking = true;
			break;
	}
}
function keyReleased(){
	switch(keyCode){
		case keyPreference.UP.key:
			myPlayer.yDir --;
			break;
		case keyPreference.RIGHT.key:
			myPlayer.xDir --;
			break;
		case keyPreference.DOWN.key:
			myPlayer.yDir ++;
			break;
		case keyPreference.LEFT.key:
			myPlayer.xDir ++;
			break;
		case keyPreference.LUP.key:
			myPlayer.lightAdjust--;
			break;
		case keyPreference.LDOWN.key:
			myPlayer.lightAdjust++;
			break;
		case keyPreference.WALK.key:
			myPlayer.walking = false;
			break;
	}
}

function loadCookies(){
	//upgrades
    createUpgrades();
	//coin
    var coinString = getCookie("coin");
    if(coinString != ""){
        myPlayer.coins = parseInt(coinString);
	}
	
	loadKeyBindings();
}
