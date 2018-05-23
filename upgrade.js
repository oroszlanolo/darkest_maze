let upgradeDat;

let upgradeGUI = [];
let upgradeButts = [];

class UpgradeTex{
    constructor(tt,x,y, siz){
        this.text = tt,
        this.x = x;
        this.y = y;
        this.tSize = siz;
        this.color = color('rgb(0,0,0)');
    }
    draw(){
        // stroke(0);
        fill(this.color);
        textSize(this.tSize);
        text(this.text,this.x,this.y);
    }
}

function createUpgrades(){
    loadUpgrades();
    createUButtons();
    setUpgradePositions();
    setPlayerAtts();
}

function createUButtons(){
    for(let i = 0; i < upgradeDat.length;i++){
        var ctmp = upgradeDat[i];
        var tmpButt = createButton("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
        tmpButt.mouseOver(mouseOnButton);
        tmpButt.mouseOut(mouseOutButton);
        tmpButt.size(120,30);
        tmpButt.id = i;
        tmpButt.mouseClicked(CBUpgradeSomething);
        upgradeButts.push(tmpButt);
        upgradeGUI.push(new UpgradeTex(ctmp.name, 120, 60 + i*45, 13));
        var tt =new UpgradeTex(ctmp.upgrades[ctmp.current].value , 300, 60 + i*45, 14);
        upgradeGUI.push(tt);
        if(ctmp.current < ctmp.upgrades.length - 1){
            tt.text +=  "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        }else{
            tmpButt.html("MAX LEVEL");
        }
        upgradeGUI.push(new UpgradeTex("LEVEL  " + ctmp.current, 420, 60 + i*45, 14));
    }
    var tmpButt = createButton("RESET");
    tmpButt.mouseOver(mouseOnButton);
    tmpButt.mouseOut(mouseOutButton);
    tmpButt.size(200,60);
    tmpButt.mouseClicked(CBReset);
    upgradeButts.push(tmpButt);
}

function CBUpgradeSomething(){
    var ctmp = upgradeDat[this.id];
    if(myPlayer.coins < ctmp.upgrades[ctmp.current].cost){
        //Not enaugh coins
        return;
    }
    if(ctmp.current == ctmp.upgrades.length - 1){
        //Already max level
        return;
    }
    myPlayer.coins -= ctmp.upgrades[ctmp.current].cost;
    ctmp.current++;
    //set GUI
    upgradeGUI[this.id*3 + 2].text = "LEVEL  " + ctmp.current;
    upgradeGUI[this.id*3 + 1].text = ctmp.upgrades[ctmp.current].value;
    if(ctmp.current < ctmp.upgrades.length - 1){
        upgradeGUI[this.id*3 + 1].text +=  "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        this.html("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
    }else{
        this.html("MAX LEVEL");
    }
    setPlayerAtts(this.id == 0, this.id == 3);
}

function CBReset(){
    if (!confirm("Reset all Upgrades and money?")) {
        return;
    }
    myPlayer.coins = 0;
    for(var i = 0; i < upgradeDat.length; i++){
        var ctmp = upgradeDat[i];
        ctmp.current = 1;
        
        upgradeButts[i].html("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
        upgradeGUI[i*3 + 2].text = "LEVEL  " + ctmp.current;
        upgradeGUI[i*3 + 1].text = ctmp.upgrades[ctmp.current].value;
        if(ctmp.current < ctmp.upgrades.length - 2){
            upgradeGUI[i*3 + 1].text +=  "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        }
    }
    setPlayerAtts(true, true);
}

function setPlayerAtts(needNewC, needNewR){
    myPlayer.maxLRange = myPlayer.lightRange = upgradeDat[0].upgrades[upgradeDat[0].current].value;
    myPlayer.baseEnergyConsumption = upgradeDat[1].upgrades[upgradeDat[1].current].value;
    myPlayer.moveEnergyConsumption = upgradeDat[2].upgrades[upgradeDat[2].current].value;
    roomNum = upgradeDat[3].upgrades[upgradeDat[3].current].value;
    myPlayer.coinMult = upgradeDat[4].upgrades[upgradeDat[4].current].value;
    myPlayer.maxEnergy = upgradeDat[5].upgrades[upgradeDat[5].current].value;
    myPlayer.speed = upgradeDat[6].upgrades[upgradeDat[6].current].value;
    myPlayer.walkSpeed = floor(myPlayer.speed / 2);
    if(needNewC){
        createCircle();
    }
    if(needNewR){
        setRooms();
    }
}

function setUpgradePositions(){
	canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    for(let i = 0; i < upgradeDat.length;i++){
        upgradeButts[i].position(canvasX + 500, canvasY + 40 + i*45);
    }
    upgradeButts[upgradeButts.length-1].position(canvasX + width / 2 - 100, canvasY + 500);
}

function loadUpgrades(){
    for(var i = 0; i < upgradeDat.length; i++){
        var tmp = getCookie(i);
        if(tmp != ""){
            upgradeDat[i].current = parseInt(tmp);
        }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function CBLoadUpgrades(loaded){
        upgradeDat = loaded;
}