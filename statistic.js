class Stat {
    constructor(name, value) {
        this.name = name;
        this.val = value;
    }
}
let stats = {
    travelled: new Stat("Distance travelled", 0), //TBD
    timeInGame: new Stat("Time spent in Game", 0), //TBD
    energyUsed: new Stat("Energy used", 0), //TBD
    energyRefilled: new Stat("Energy refilled", 0), //TBD
    treasureRoomsEntered: new Stat("Treasure rooms entered", 0), //TBD
    wallsBroken: new Stat("Dungeon walls broken", 0), //TBD
    fullClears: new Stat("Dungeons fully cleared", 0), //TBD
    coins: {
        allTime: new Stat("All coins found", 0), //TBD
        oneGame: new Stat("Maximum coins from one dungeon", 0), //TBD
        spent: new Stat("All coins spent", 0), //TBD
    },
    upgrades: {
        coinSpent: new Stat("Coins spent on upgrades", 0), //TBD
        allLevels: new Stat("All upgrade leveles", 0), //TBD
    },
    shop: {
        coinSpent: new Stat("Coins spent on shop", 0), //TBD
        itemsPurchased: new Stat("Items purchased in shop", 0), //TBD
        miniFuelUsed: new Stat("Small fuels used", 0), //TBD
        maxiFuelUsed: new Stat("Large fuels used", 0), //TBD
        coinboostUsed: new Stat("Coin boosts used", 0), //TBD
        lightboostUsed: new Stat("Light boosts used", 0) //TBD
    }
}

function loadStats() {
    var cooktmp = getCookie("st_travelled")
    stats.travelled.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_timeInGame")
    stats.timeInGame.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_energyUsed")
    stats.energyUsed.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_energyRefilled")
    stats.energyRefilled.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_treasureRoomsEntered")
    stats.treasureRoomsEntered.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_wallsBroken")
    stats.wallsBroken.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_fullClears")
    stats.fullClears.val = cooktmp == "" ? 0 : parseInt(cooktmp);

    cooktmp = getCookie("st_coins_allTime")
    stats.coins.allTime.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_coins_oneGame")
    stats.coins.oneGame.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_coins_spent")
    stats.coins.spent.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_upgrades_coinSpent")
    stats.upgrades.coinSpent.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_upgrades_allLevels")
    stats.upgrades.allLevels.val = cooktmp == "" ? 0 : parseInt(cooktmp);

    cooktmp = getCookie("st_shop_coinSpent")
    stats.shop.coinSpent.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_shop_itemsPurchased")
    stats.shop.itemsPurchased.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_shop_miniFuelUsed")
    stats.shop.miniFuelUsed.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_shop_maxiFuelUsed")
    stats.shop.maxiFuelUsed.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_shop_coinboostUsed")
    stats.shop.coinboostUsed.val = cooktmp == "" ? 0 : parseInt(cooktmp);
    cooktmp = getCookie("st_shop_lightboostUsed")
    stats.shop.lightboostUsed.val = cooktmp == "" ? 0 : parseInt(cooktmp);

    for (var i = 0; i < upgradeDat.length; i++) {
        var currUp = upgradeDat[i];
        stats.upgrades.allLevels += currUp.current;
    }

    if (stats.coins.allTime == 0) {
        calcStat();
    }
}

function calcStat() {
    for (var i = 0; i < upgradeDat.length; i++) {
        var currUp = upgradeDat[i];
        for (j = 1; j < currUp.current; j++) {
            stats.upgrades.coinSpent += currUp.upgrades[j].cost;
        }
    }
    stats.coins.spent = stats.upgrades.coinSpent;
    stats.coins.allTime = stats.coins.spent + maze.player.coins;

}

function saveStats() {
    document.cookie = "st_travelled=" + stats.travelled + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_timeInGame=" + stats.timeInGame + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_energyUsed=" + stats.energyUsed + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_energyRefilled=" + stats.energyRefilled + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_treasureRoomsEntered=" + stats.treasureRoomsEntered + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_wallsBroken=" + stats.wallsBroken + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_fullClears=" + stats.fullClears + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_coins_allTime=" + stats.coins.allTime + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_coins_oneGame=" + stats.coins.oneGame + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_coins_spent=" + stats.coins.spent + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_upgrades_coinSpent=" + stats.upgrades.coinSpent + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_upgrades_allLevels=" + stats.upgrades.allLevels + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_coinSpent=" + stats.shop.coinSpent + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_itemsPurchased=" + stats.shop.itemsPurchased + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_miniFuelUsed=" + stats.shop.miniFuelUsed + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_maxiFuelUsed=" + stats.shop.maxiFuelUsed + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_coinboostUsed=" + stats.shop.coinboostUsed + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
    document.cookie = "st_shop_lightboostUsed=" + stats.shop.lightboostUsed + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
}