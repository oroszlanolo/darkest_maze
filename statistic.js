let stats = {
    travelled : 0,
    timeInGame: 0,
    energyUsed: 0,
    energyRefilled: 0,
    treasureRoomsEntered: 0,
    wallsBroken: 0,
    fullClears: 0,
    coins : {
        allTime: 0,
        oneGame : 0,
        spent : 0,
    },
    upgrades: {
        coinSpent: 0,
        allLevels: 0,
    },
    shop: {
        coinSpent : 0,
        itemsPurchased : 0,
        miniFuelUsed: 0,
        maxiFuelUsed: 0,
        coinboostUsed: 0,
        lightboostUsed: 0
    }
}

function loadStats(){
    var cooktmp = getCookie("travelled")
    stats.travelled = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("timeInGame")
    stats.timeInGame = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("energyUsed")
    stats.energyUsed = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("energyRefilled")
    stats.energyRefilled = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("treasureRoomsEntered")
    stats.treasureRoomsEntered = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("wallsBroken")
    stats.wallsBroken = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("fullClears")
    stats.fullClears = cooktmp == "" ? 0 : parseInt(cooktmp);

    cooktmp = getCookie("coins_allTime")
    stats.coins.allTime = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("coins_oneGame")
    stats.coins.oneGame = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("coins_spent")
    stats.coins.spent = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("upgrades_coinSpent")
    stats.upgrades.coinSpent = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("upgrades_allLevels")
    stats.upgrades.allLevels = cooktmp == "" ? 0 : parseInt(cooktmp);

    cooktmp = getCookie("shop_coinSpent")
    stats.shop.coinSpent = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("shop_itemsPurchased")
    stats.shop.itemsPurchased = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("shop_miniFuelUsed")
    stats.shop.miniFuelUsed = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("shop_maxiFuelUsed")
    stats.shop.maxiFuelUsed = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("shop_coinboostUsed")
    stats.shop.coinboostUsed = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("shop_lightboostUsed")
    stats.shop.lightboostUsed = cooktmp == "" ? 0 : parseInt(cooktmp);

    for(var i = 0; i < upgradeDat.length; i++){
        var currUp = upgradeDat[i];
        stats.upgrades.allLevels += currUp.current;
    }

    if(stats.coins.allTime == 0){
        calcStat();
    }
}

function calcStat(){
    for(var i = 0; i < upgradeDat.length; i++){
        var currUp = upgradeDat[i];
        for(j = 1; j < currUp.current; j++){
            stats.upgrades.coinSpent += currUp.upgrades[j].cost;
        }
    }
    stats.coins.spent = stats.upgrades.coinSpent;
    stats.coins.allTime = stats.coins.spent + myPlayer.coins;

}