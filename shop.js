let shopGUI = [];
let shopButts = [];

let itemsDat;

function createShop() {
    maze.player.items = Object.keys(itemsDat).map(function (key) {
        return itemsDat[key];
    });
    loadItems();
    setFunctionality();
    createSButtons();
}

function createSButtons() {
    for (var i = 0; i < maze.player.items.length; i++) {
        var curr = maze.player.items[i];
        shopGUI.push(new BBText(curr.name, 200, 65 + i * 50, 13, curr.description));
        shopGUI.push(new BBText(curr.quant + " pcs", 400, 65 + i * 50, 13));
        var tmpButt = createButton(curr.price + " coins");
        tmpButt.mouseOver(mouseOnButton);
        tmpButt.mouseOut(mouseOutButton);
        tmpButt.size(120, 40);
        tmpButt.id = i;
        tmpButt.mouseClicked(CBBoughtSomething);
        shopButts.push(tmpButt);
    }
}

function setShopPos() {
    canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    for (var i = 0; i < shopButts.length; i++) {
        shopButts[i].position(canvasX + 500, canvasY + 40 + i * 50);
    }
}

function CBBoughtSomething() {
    var i = this.id;
    if (maze.player.coins < maze.player.items[i].price) {
        return;
    }
    maze.player.coins -= maze.player.items[i].price;
    maze.player.items[i].quant++;
    shopGUI[i * 2 + 1].text = maze.player.items[i].quant + " pcs";
}

function CBLoadItems(items) {
    itemsDat = items;
}


function setFunctionality() {
    for (var i = 0; i < maze.player.items.length; i++) {
        var curr = maze.player.items[i];
        curr.processable = () => {
            return true;
        }
    }
    itemsDat.miniFuelRefill.process = function () {
        maze.player.giveEnergy(20);
        print(itemsDat.miniFuelRefill.name);
    }
    itemsDat.mediumFuelRefill.process = function () {
        maze.player.giveEnergy(50);
        print(itemsDat.mediumFuelRefill.name);
    }
    itemsDat.maxiFuelRefill.process = function () {
        maze.player.giveEnergy(100);
        print(itemsDat.maxiFuelRefill.name);
    }
    itemsDat.coinBoost_1.process = function () {
        maze.player.coinMult *= 2;
        maze.player.buffs.coinMult.active = true;
        maze.player.buffs.coinMult.start = millis();
        maze.player.buffs.coinMult.time = maze.player.buffs.coinMult.start + 10000;
        print(itemsDat.coinBoost_1.name);
    }
    itemsDat.coinBoost_1.processable = function () {
        return !maze.player.buffs.coinMult.active;
    }
    itemsDat.lightRangeBoost_1.process = function () {
        maze.player.maxLRange += 50;
        maze.player.lightRange = maze.player.maxLRange;
        maze.player.buffs.lightRange.active = true;
        maze.player.buffs.lightRange.value = 50;
        maze.player.buffs.lightRange.start = millis();
        maze.player.buffs.lightRange.time = maze.player.buffs.lightRange.start + 10000;
        createCircle();
        print(itemsDat.lightRangeBoost_1.name);
    }
    itemsDat.lightRangeBoost_1.processable = function () {
        return !maze.player.buffs.lightRange.active;
    }
}

function loadItems() {
    for (var i = 0; i < maze.player.items.length; i++) {
        var tmp = getCookie(maze.player.items[i].name);
        if (tmp != "") {
            maze.player.items[i].quant = parseInt(tmp);
        }
    }
}