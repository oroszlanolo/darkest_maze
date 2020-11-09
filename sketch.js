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
const MAZECOLS = 32;
const MAZEROWS = 24;
const WALLW = 4;
const SPACEW = 20;
const PLAYERW = 16;
const SIMPLICTY = 20;

const actualW = 772;
const actualH = 580;

let myCanvas;
let guiH = 100;

let gameState;

let cirkImg;
let cirks = [];

let frcnt;

let maze;
let decorMaze;

let gameSt = {
	MMenu: 0,
	Shop: 1,
	Upgrade: 2,
	Dungeon: 3,
	Settings: 4,
	KeyBind: 5
}

let robotImg;
let coinImg;

function preload() {
	loadJSON("upgrades.json", CBLoadUpgrades);
	loadJSON("items.json", CBLoadItems);
	robotImg = loadImage("pics/robot_front.png");
	coinImg = loadImage("pics/coin_0.png");
}

function setup() {
	// frameRate(30);
	maze = new Maze(MAZECOLS, MAZEROWS, WALLW, SPACEW, PLAYERW, SIMPLICTY, 2);
	myCanvas = createCanvas(actualW, actualH + guiH);
	myCanvas.parent("canvasD");
	canvasX = myCanvas.position().x;
	canvasY = myCanvas.position().y;
	maze.player = new Player(maze.wallW + maze.playerW / 2, maze.wallW + maze.playerW / 2, maze.playerW);
	loadCookies();
	createGUI();
	createCirk(maze.player.lightRange);
	loadStats();
	frcnt = 0;
	// setInterval(frCount,1000);
	maze.generate();
	decorMaze = new DecorMaze(MAZECOLS * 2, MAZEROWS * 2, WALLW, SPACEW, PLAYERW, SIMPLICTY, MAZEROWS, MAZECOLS);

	decorMaze.generate();
	// BBGodMode();
}

function newGame() {
	maze.reset();
}

function frCount() {
	print(frcnt);
	frcnt = 0;
}

function createCirk(n) {
	var cirktmp = createGraphics(n * 2, n * 2);
	cirktmp.loadPixels();
	for (var i = -n; i <= n; i++) {
		for (var j = -n; j <= n; j++) {
			let brightness = map(sqrt(sqrt(i * i + j * j)), 0, sqrt(n), 0, 255);
			let ind = (cirktmp.width * (i + cirktmp.height / 2) + j + cirktmp.width / 2) * 4;
			cirktmp.pixels[ind] = (255 - brightness) * 0.2;
			cirktmp.pixels[ind + 1] = (255 - brightness) * 0.1;
			cirktmp.pixels[ind + 2] = 0;
			cirktmp.pixels[ind + 3] = brightness;
		}
	}
	cirktmp.updatePixels();
	cirks[n] = cirktmp;
}

function BBGodMode() {
	maze.player.lightRange = 100;
	maze.player.coins = 10000;
	maze.player.breakConsume = 0;
	maze.player.maxEnergy = 100000;
}

function drawToolTips(GUIArray) {
	for (var i = 0; i < GUIArray.length; i++) {
		if (GUIArray[i].crash(mouseX, mouseY)) {
			GUIArray[i].drawTooltip(mouseX, mouseY);
		}
	}
}

function draw() {
	frcnt++;
	switch (gameState) {
		case gameSt.MMenu:
			drawMainMenu();
			break;
		case gameSt.Shop:
			background(255);
			for (var st of shopGUI) {
				st.draw();
			}
			drawToolTips(shopGUI);
			break;
		case gameSt.Upgrade:
			background(255);
			for (var ut of upgradeGUI) {
				ut.draw();
			}
			drawToolTips(upgradeGUI);
			break;
		case gameSt.Settings:
			background(255);
			for (var st of settingsText) {
				st.draw();
			}
			drawToolTips(settingsText);
			break;
		case gameSt.KeyBind:
			background(255);
			for (var kt of keyBindGUI) {
				kt.draw();
			}
			drawToolTips(keyBindGUI);
			break;
		case gameSt.Dungeon:
			background(0);
			stroke(255, 0, 0);
			fill(255, 0, 0);
			maze.movePlayer();
			maze.draw();
			break;
	}
	drawGUI();
}


function loadCookies() {
	//upgrades
	createUpgrades();
	//coin
	var coinString = getCookie("coin");
	if (coinString != "") {
		maze.player.coins = parseInt(coinString);
	}

	loadKeyBindings();
}