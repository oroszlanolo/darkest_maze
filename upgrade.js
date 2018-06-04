let upgradeDat;

let upgradeGUI = [];
let upgradeButts = [];

class UpgradeTex{
    constructor(tt,x,y, siz, description){
        this.text = tt,
        this.x = x;
        this.y = y;
        this.tSize = siz;
        this.description = description;
        this.color = color('rgb(0,0,0)');
    }
    draw(){
        // stroke(0);
        fill(this.color);
        textSize(this.tSize);
        text(this.text,this.x,this.y);
    }
    crash(x,y){
        return  (x >= this.x &&
                y <= this.y &&
                x <= this.x + textWidth(this.text) &&
                y >= parseInt(this.y) - this.tSize);
    }
    drawTooltip(x,y){
        if(!this.description){
            return;
        }
        var tt = this.description;
            if(textWidth(tt) > 200){
                textSize(15);
                var rat = ceil(textWidth(tt) / 200);
                var crNum = floor(tt.length / rat);
                var texts = [];
                for(var i = 0; i < rat; i++){
                    texts[i] = tt.slice(i*crNum,(i+1)*crNum);
                }
                var wid = textWidth(texts.reduce((a,b) => {return textWidth(a) > textWidth(b) ? a : b;}));
                stroke(0);
                fill(255);
                rect(x + 20,y,wid + 7,15*rat + 7);
                noStroke();
                fill(0);
                for(var i = 0; i < rat; i++){
                    text(texts[i],x+23,y+2 + (i + 1) * 15);
                }
            }else{
                stroke(0);
                fill(255);
                textSize(15);
                rect(x,y-20,textWidth(tt) + 4,18);
                noStroke();
                fill(0);
                text(tt,x+2,y-4);
            }
        
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
        upgradeGUI.push(new UpgradeTex(ctmp.name, 120, 60 + i*45, 13, ctmp.description));
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
    setPlayerAtts(this.id == 3);
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
    setPlayerAtts(true);
}

function setPlayerAtts(needNewR){
    myPlayer.maxLRange = myPlayer.lightRange = upgradeDat[0].upgrades[upgradeDat[0].current].value;
    myPlayer.baseEnergyConsumption = upgradeDat[1].upgrades[upgradeDat[1].current].value;
    myPlayer.moveEnergyConsumption = upgradeDat[2].upgrades[upgradeDat[2].current].value;
    roomNum = upgradeDat[3].upgrades[upgradeDat[3].current].value;
    myPlayer.coinMult = upgradeDat[4].upgrades[upgradeDat[4].current].value;
    myPlayer.maxEnergy = upgradeDat[5].upgrades[upgradeDat[5].current].value;
    myPlayer.speed = upgradeDat[6].upgrades[upgradeDat[6].current].value;
    myPlayer.walkSpeed = floor(myPlayer.speed / 2);
    myPlayer.breakConsume = upgradeDat[7].upgrades[upgradeDat[7].current].value;
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