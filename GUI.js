
var cols = [10,70,500,650];
let mMenuButts = [];
let newDungeonButt;
let shopButt;
let upgradeButt;
let settingsButt;

let mMenuButt;
let saveButt;

function createGUI(){
    createButts();
    createSettings();
    createKeyBindGUI();
    changeGState(gameSt.MMenu);
    setPositions();
}

function drawGUI(){
	stroke(255,255,255);
	fill(255,255,255);
	push();
	translate(0,mazeH);
    rect(0,0,mazeW,guiH);
    writePlayerInfo();
    
	pop();
}

function writePlayerInfo(){
    noStroke();
    fill(0);
    textSize(14);
    //energy
    text("Energy:", cols[0], 24);
    stroke(0);
    noFill();
    rect(cols[1],9,350,20);
    var rectWidth = map(myPlayer.energy, 0, myPlayer.maxEnergy, 0, 350);
    fill(0,0,255);
    rect(cols[1],9,rectWidth,20);
    fill(0);
    textAlign(CENTER);
    text(floor(myPlayer.energy),250,25);
    //coins
    textAlign(LEFT);
    noStroke();
    text("Coins:", cols[0], 50);
    text(myPlayer.coins, cols[1],50);
}

function createButts(){
    createMMenu();

    mMenuButt = createButton("MAIN MENU");
    mMenuButt.mouseClicked(CBMMenu);
    mMenuButt.size(100,30);
    mMenuButt.mouseOver(mouseOnButton);
    mMenuButt.mouseOut(mouseOutButton);

    saveButt = createButton("SAVE");
    saveButt.mouseClicked(CBSave);
    saveButt.size(100,30);
    saveButt.mouseOver(mouseOnButton);
    saveButt.mouseOut(mouseOutButton);
}

function createMMenu(){
    newDungeonButt = createButton("NEW MAZE");
    mMenuButts.push(newDungeonButt);
    newDungeonButt.mouseClicked(CBNewDungeon);
    newDungeonButt.size(300,100);
    newDungeonButt.mouseOver(mouseOnButton);
    newDungeonButt.mouseOut(mouseOutButton);

    shopButt = createButton("SHOP");
    mMenuButts.push(shopButt);
    shopButt.mouseClicked(CBShop);
    shopButt.size(300,100);
    shopButt.mouseOver(mouseOnButton);
    shopButt.mouseOut(mouseOutButton);
    
    upgradeButt = createButton("UPGRADE");
    mMenuButts.push(upgradeButt);
    upgradeButt.mouseClicked(CBUpgrade);
    upgradeButt.size(300,100);
    upgradeButt.mouseOver(mouseOnButton);
    upgradeButt.mouseOut(mouseOutButton); 

    settingsButt = createButton("SETTINGS");
    mMenuButts.push(settingsButt);
    settingsButt.mouseClicked(CBSettings);
    settingsButt.size(150,50);
    settingsButt.mouseOver(mouseOnButton);
    settingsButt.mouseOut(mouseOutButton);
}



function windowResized(){
    setPositions();
}

function setPositions(){
	canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    newDungeonButt.position(canvasX + width/2 - newDungeonButt.width/2, canvasY + 100);
    shopButt.position(canvasX + width/2 - shopButt.width/2, canvasY + 220);
    upgradeButt.position(canvasX + width/2 - upgradeButt.width/2, canvasY + 340);
    settingsButt.position(canvasX + 5, canvasY + mazeH - settingsButt.height - 5);
    mMenuButt.position(canvasX + cols[3], canvasY + mazeH + 10);
    saveButt.position(canvasX + cols[3], canvasY + mazeH + 50);
    setUpgradePositions();
    setSettingsPositions();
    setKeyBindPos();
}



//#region Callbacks
function CBMMenu(){
    changeGState(gameSt.MMenu);
    setChangingFalse();
}

function CBNewDungeon(){
    changeGState(gameSt.Dungeon);
    newGame();
}

function CBShop(){
    changeGState(gameSt.Shop);

}

function CBUpgrade(){
    changeGState(gameSt.Upgrade);

}

function CBSettings(){
    changeGState(gameSt.Settings);

}

function changeGState(gst){
    switch(gst){
        case gameSt.MMenu:
        showButts(mMenuButts);
        hideButts(upgradeButts);
        hideButts(settingsGUI);
        hideButts(keyBindButts);
        break;
        case gameSt.Shop:
        hideButts(mMenuButts);
        hideButts(upgradeButts);
        hideButts(settingsGUI);
        break;
        case gameSt.Upgrade:
        hideButts(mMenuButts);
        showButts(upgradeButts);
        hideButts(settingsGUI);
        break;
        case gameSt.Dungeon:
        hideButts(mMenuButts);
        hideButts(upgradeButts);
        hideButts(settingsGUI);
        break;
        case gameSt.Settings:
        hideButts(mMenuButts);
        hideButts(upgradeButts);
        hideButts(keyBindButts);
        showButts(settingsGUI);
        break;
        case gameSt.KeyBind:
        hideButts(settingsGUI);
        showButts(keyBindButts);
    }
    gameState = gst;
}

function hideButts(buttArr){
    for(var b of buttArr){
        b.hide();
    }
}
function showButts(buttArr){
    for(var b of buttArr){
        b.show();
    }
}

function CBSave(){
    for(var i = 0; i < upgradeDat.length; i++){
        document.cookie = i + "=" + upgradeDat[i].current + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    }
    document.cookie = "coin=" + myPlayer.coins + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    
    for(var i = 0; i < preferenceArray.length; i++){
        document.cookie = preferenceArray[i].name + "=" + preferenceArray[i].key + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    }
}


function mouseOutButton(){
    this.style("color","black");
}
function mouseOnButton(){
    this.style("color","red");
}
//#endregion