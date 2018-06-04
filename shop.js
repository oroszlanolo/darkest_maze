let shopGUI = [];
let shopButts = [];

let itemsDat;

function createShop(){
    myPlayer.items = Object.keys(itemsDat).map(function (key) { return itemsDat[key]; });
    loadItems();
    setFunctionality();
    createSButtons();
}

function createSButtons(){
    for(var i = 0; i < myPlayer.items.length; i++){
        var curr = myPlayer.items[i];
        shopGUI.push(new UpgradeTex(curr.name, 200, 65 + i*50, 13, curr.description));
        shopGUI.push(new UpgradeTex(curr.quant + " pcs", 400, 65 + i*50, 13));
        var tmpButt = createButton(curr.price + " coins");
        tmpButt.mouseOver(mouseOnButton);
        tmpButt.mouseOut(mouseOutButton);
        tmpButt.size(120,40);
        tmpButt.id = i;
        tmpButt.mouseClicked(CBBoughtSomething);
        shopButts.push(tmpButt);
    }
}
function setShopPos(){
	canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    for(var i = 0; i < shopButts.length; i++){
        shopButts[i].position(canvasX + 500, canvasY + 40 + i*50);
    }
}

function CBBoughtSomething(){
    var i = this.id;
    if(myPlayer.coins < myPlayer.items[i].price){
        return;
    }
    myPlayer.coins -= myPlayer.items[i].price;
    myPlayer.items[i].quant ++;
    shopGUI[i*2 + 1].text = myPlayer.items[i].quant + " pcs";
}

function CBLoadItems(items){
    itemsDat = items;
}


function setFunctionality(){
    for(var i = 0; i < myPlayer.items.length; i++){
        var curr = myPlayer.items[i];
        curr.processable = () => {return true;}
    }
    itemsDat.miniFuelRefill.process = function () {
        myPlayer.giveEnergy(20);
        print(itemsDat.miniFuelRefill.name);
    }
    itemsDat.mediumFuelRefill.process = function () {
        myPlayer.giveEnergy(50);
        print(itemsDat.mediumFuelRefill.name);
    }
    itemsDat.maxiFuelRefill.process = function () {
        myPlayer.giveEnergy(100);
        print(itemsDat.maxiFuelRefill.name);
    }
    itemsDat.coinBoost_1.process = function () {
        myPlayer.coinMult *= 2;
        myPlayer.buffs.coinMult.active = true;
        myPlayer.buffs.coinMult.start = millis();
        myPlayer.buffs.coinMult.time = myPlayer.buffs.coinMult.start + 10000;
        print(itemsDat.coinBoost_1.name);
    }
    itemsDat.coinBoost_1.processable = function () {
        return !myPlayer.buffs.coinMult.active;
    }
    itemsDat.lightRangeBoost_1.process = function () {
        myPlayer.maxLRange += 50;
        myPlayer.lightRange = myPlayer.maxLRange;
        myPlayer.buffs.lightRange.active = true;
        myPlayer.buffs.lightRange.value = 50;
        myPlayer.buffs.lightRange.start = millis();
        myPlayer.buffs.lightRange.time = myPlayer.buffs.lightRange.start + 10000;
        createCircle();
        print(itemsDat.lightRangeBoost_1.name);
    }
    itemsDat.lightRangeBoost_1.processable = function () {
        return !myPlayer.buffs.lightRange.active;
    }
}

function loadItems(){
    for(var i = 0; i < myPlayer.items.length; i++){
        var tmp = getCookie(myPlayer.items[i].name);
        if(tmp != ""){
            myPlayer.items[i].quant = parseInt(tmp);
        }
    }
}