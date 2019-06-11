let upgradeDat;

let upgradeGUI = [];
let upgradeButts = [];


function createUpgrades() {
    loadUpgrades();
    createUButtons();
    setUpgradePositions();
    setPlayerAtts();
}

function createUButtons() {
    for (let i = 0; i < upgradeDat.length; i++) {
        var ctmp = upgradeDat[i];
        var tmpButt = createButton("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
        tmpButt.mouseOver(mouseOnButton);
        tmpButt.mouseOut(mouseOutButton);
        tmpButt.size(120, 30);
        tmpButt.id = i;
        tmpButt.mouseClicked(CBUpgradeSomething);
        upgradeButts.push(tmpButt);
        upgradeGUI.push(new BBText(ctmp.name, 120, 60 + i * 45, 13, ctmp.description));
        var tt = new BBText(ctmp.upgrades[ctmp.current].value, 300, 60 + i * 45, 14);
        upgradeGUI.push(tt);
        if (ctmp.current < ctmp.upgrades.length - 1) {
            tt.text += "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        } else {
            tmpButt.html("MAX LEVEL");
        }
        upgradeGUI.push(new BBText("LEVEL  " + ctmp.current, 420, 60 + i * 45, 14));
    }
    var tmpButt = createButton("RESET");
    tmpButt.mouseOver(mouseOnButton);
    tmpButt.mouseOut(mouseOutButton);
    tmpButt.size(200, 60);
    tmpButt.mouseClicked(CBReset);
    upgradeButts.push(tmpButt);
}

function CBUpgradeSomething() {
    var ctmp = upgradeDat[this.id];
    if (maze.player.coins < ctmp.upgrades[ctmp.current].cost) {
        //Not enaugh coins
        return;
    }
    if (ctmp.current == ctmp.upgrades.length - 1) {
        //Already max level
        return;
    }
    maze.player.coins -= ctmp.upgrades[ctmp.current].cost;
    ctmp.current++;
    //set GUI
    upgradeGUI[this.id * 3 + 2].text = "LEVEL  " + ctmp.current;
    upgradeGUI[this.id * 3 + 1].text = ctmp.upgrades[ctmp.current].value;
    if (ctmp.current < ctmp.upgrades.length - 1) {
        upgradeGUI[this.id * 3 + 1].text += "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        this.html("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
    } else {
        this.html("MAX LEVEL");
    }
    setPlayerAtts(this.id == 3);
}

function CBReset() {
    if (!confirm("Reset all Upgrades and money?")) {
        return;
    }
    maze.player.coins = 0;
    for (var i = 0; i < upgradeDat.length; i++) {
        var ctmp = upgradeDat[i];
        ctmp.current = 1;

        upgradeButts[i].html("Upgrade: " + ctmp.upgrades[ctmp.current].cost);
        upgradeGUI[i * 3 + 2].text = "LEVEL  " + ctmp.current;
        upgradeGUI[i * 3 + 1].text = ctmp.upgrades[ctmp.current].value;
        if (ctmp.current < ctmp.upgrades.length - 2) {
            upgradeGUI[i * 3 + 1].text += "(-> " + ctmp.upgrades[ctmp.current + 1].value + ")";
        }
    }
    setPlayerAtts(true);
}

function setPlayerAtts(needNewR) {
    maze.player.maxLRange = maze.player.lightRange = upgradeDat[0].upgrades[upgradeDat[0].current].value;
    maze.player.baseEnergyConsumption = upgradeDat[1].upgrades[upgradeDat[1].current].value;
    maze.player.moveEnergyConsumption = upgradeDat[2].upgrades[upgradeDat[2].current].value;
    maze.roomNum = upgradeDat[3].upgrades[upgradeDat[3].current].value;
    maze.player.coinMult = upgradeDat[4].upgrades[upgradeDat[4].current].value;
    maze.player.maxEnergy = upgradeDat[5].upgrades[upgradeDat[5].current].value;
    maze.player.speed = upgradeDat[6].upgrades[upgradeDat[6].current].value;
    maze.player.walkSpeed = floor(maze.player.speed / 2);
    maze.player.breakConsume = upgradeDat[7].upgrades[upgradeDat[7].current].value;
    if (needNewR) {
        setRooms();
    }
}

function setUpgradePositions() {
    canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    for (let i = 0; i < upgradeDat.length; i++) {
        upgradeButts[i].position(canvasX + 500, canvasY + 40 + i * 45);
    }
    upgradeButts[upgradeButts.length - 1].position(canvasX + width / 2 - 100, canvasY + 500);
}

function loadUpgrades() {
    for (var i = 0; i < upgradeDat.length; i++) {
        var tmp = getCookie(i);
        if (tmp != "") {
            upgradeDat[i].current = parseInt(tmp);
        }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

function CBLoadUpgrades(loaded) {
    upgradeDat = loaded;
}