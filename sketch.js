
//TODO: Statistic
//TODO: Achivement
//TODO: collections
//TODO: pickable fuel
//TODO: power ups
//TODO: Tips
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
let cirks = [];

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
	loadJSON("items.json",CBLoadItems);
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
	createCirk(myPlayer.lightRange);
	loadStats();
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
function createCirk(n){
	var cirktmp = createGraphics(n * 2, n * 2);
		cirktmp.loadPixels();
		for(var i = -n; i <= n; i++){
			for(var j = -n; j <= n; j++){
				let brightness = map(sqrt(i*i + j*j), 0, n, 0, 255);
				let ind = (cirktmp.width * (i + cirktmp.height / 2) + j + cirktmp.width/2) * 4;
				cirktmp.pixels[ind] = 0;
				cirktmp.pixels[ind + 1] = 0;
				cirktmp.pixels[ind + 2] = 0;
				cirktmp.pixels[ind + 3] = brightness;
			}
		}
		cirktmp.updatePixels();
		cirks[n] = cirktmp;
}

function drawTools(GUIArray){
	for(var i = 0; i < GUIArray.length; i++){
		if(GUIArray[i].crash(mouseX,mouseY)){
			GUIArray[i].drawTooltip(mouseX,mouseY);
		}
	}
}

function draw() {
	frcnt++;
	switch(gameState){
		case gameSt.MMenu:
			background(255);
			break;
		case gameSt.Shop:
		background(255);
			for(var st of shopGUI){
				st.draw();
			}
			drawTools(shopGUI);
			break;
		case gameSt.Upgrade:
			background(255);
			for(var ut of upgradeGUI){
				ut.draw();
			}
			drawTools(upgradeGUI);
			break;
		case gameSt.Settings:
		background(255);
			for(var st of settingsText){
				st.draw();
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
			myPlayer.draw(parseInt(graphSelect.value()));
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
	if(cirks[lightRange] == null){
		createCirk(lightRange);
	}
	var xPos = myPlayer.x-cirks[lightRange].width/2;
	var yPos = myPlayer.y-cirks[lightRange].height/2;
	image(cirks[lightRange],xPos,yPos);
	fill(0);
	stroke(0);
	if(xPos > 0){
		rect(0,0,ceil(xPos),mazeH);
	}
	if(yPos > 0){
		rect(0,0,mazeW,ceil(yPos));
	}
	if(xPos+cirks[lightRange].width < mazeW){
		rect(xPos+floor(cirks[lightRange].width),0,mazeW,mazeH);
	}
	if(yPos+cirks[lightRange].height < mazeH){
		rect(0,yPos+floor(cirks[lightRange].height),mazeW,mazeH);
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
			myPlayer.setDir(0,1);
			// myPlayer.yDir ++;
			break;
		case keyPreference.RIGHT.key:
			myPlayer.setDir(1,0);
			// myPlayer.xDir ++;
			break;
		case keyPreference.DOWN.key:
			myPlayer.setDir(0,-1);
			// myPlayer.yDir --;
			break;
		case keyPreference.LEFT.key:
			myPlayer.setDir(-1,0);
			// myPlayer.xDir --;
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
		case keyPreference.BREAK.key:
			myPlayer.breakWall();
			break;
	}
}
function keyReleased(){
	switch(keyCode){
		case keyPreference.UP.key:
			myPlayer.setDir(0,-1);
			// myPlayer.yDir --;
			break;
		case keyPreference.RIGHT.key:
		myPlayer.setDir(-1,0);
			// myPlayer.xDir --;
			break;
		case keyPreference.DOWN.key:
		myPlayer.setDir(0,1);
			// myPlayer.yDir ++;
			break;
		case keyPreference.LEFT.key:
		myPlayer.setDir(1,0);
			// myPlayer.xDir ++;
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
function keyTyped(){
	if(gameState == gameSt.Dungeon){
		switch(keyCode){
			case keyPreference.ZERO.key:
			myPlayer.useItem(0);
			break;
			case keyPreference.ONE.key:
			myPlayer.useItem(1);
			break;
			case keyPreference.TWO.key:
			myPlayer.useItem(2);
			break;
			case keyPreference.TREE.key:
			myPlayer.useItem(3);
			break;
			case keyPreference.FOUR.key:
			myPlayer.useItem(4);
			break;
			case keyPreference.FIVE.key:
			myPlayer.useItem(5);
			break;
			case keyPreference.SIX.key:
			myPlayer.useItem(6);
			break;
			case keyPreference.SEVEN.key:
			myPlayer.useItem(7);
			break;
			case keyPreference.EIGHT.key:
			myPlayer.useItem(8);
			break;
		}
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
