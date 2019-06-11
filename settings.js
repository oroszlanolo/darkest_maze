let keyBindButt;
let codeBox;
let codeButt;
let graphSelect;
let graphText;
let colorSelect;
let colorText;

let settingsGUI = [];
let settingsText = [];

function createSettings() {
    keyBindButt = createButton("KEYBINDINGS");
    settingsGUI.push(keyBindButt);
    keyBindButt.mouseClicked(CBKeyBind);
    keyBindButt.size(200, 70);
    keyBindButt.mouseOver(mouseOnButton);
    keyBindButt.mouseOut(mouseOutButton);

    graphText = new BBText("Player Texture:", width / 2 - 80, 230, 14);
    settingsText.push(graphText);

    graphSelect = createSelect();
    graphSelect.option(0);
    graphSelect.option(1);
    graphSelect.option(2);
    graphSelect.option(3);
    graphSelect.option(4);
    settingsGUI.push(graphSelect);

    colorText = new BBText("Player Color:", width / 2 - 80, 265, 14);
    settingsText.push(colorText);


    colorSelect = createSelect();
    colorSelect.option("blue");
    colorSelect.option("green");
    colorSelect.option("black");
    colorSelect.option("purple");
    colorSelect.changed(CBColor);
    settingsGUI.push(colorSelect);



    codeButt = createButton("USE CODE");
    settingsGUI.push(codeButt);
    codeButt.mouseClicked(CBUseCode);
    codeButt.size(100, 40);
    codeButt.mouseOver(mouseOnButton);
    codeButt.mouseOut(mouseOutButton);

    codeBox = createInput("code");
    settingsGUI.push(codeBox);

    loadSettings();
}



function setSettingsPositions() {
    keyBindButt.position(canvasX + width / 2 - keyBindButt.width / 2, canvasY + 100);
    graphSelect.position(canvasX + width / 2 + 20, canvasY + 215);
    colorSelect.position(canvasX + width / 2 + 20, canvasY + 250);
    codeBox.position(canvasX + width / 2 - 180, canvasY + 520);
    codeButt.position(canvasX + width / 2 + 50, canvasY + 510);
}

function CBColor() {
    switch (colorSelect.value()) {
        case "blue":
            maze.player.color = color("rgb(0,0,255)");
            break;
        case "green":
            maze.player.color = color("rgb(0,255,0)");
            break;
        case "black":
            maze.player.color = color("rgb(0,0,0)");
            break;
        case "purple":
            maze.player.color = color("rgb(200,0,255)");
            break;
    }
}

function CBKeyBind() {
    changeGState(gameSt.KeyBind);
}

function CBUseCode() {
    if (codeBox.value() == "szabi120") {
        if (!giveSzabi120()) {
            codeBox.value("Code already used!");
            return;
        }
    }
    codeBox.value("code");
}

function loadSettings() {
    var loadString = getCookie("Player Graph");
    if (loadString != "") {
        graphSelect.value(loadString);
    }
    loadString = getCookie("Player Color");
    if (loadString != "") {
        colorSelect.value(loadString);
    }
    CBColor();
}


//#region KEYBIND


let keyPreference = {
    ZERO: {
        name: "Use 0",
        key: 48
    },
    ONE: {
        name: "Use 1",
        key: 49
    },
    TWO: {
        name: "Use 2",
        key: 50
    },
    TREE: {
        name: "Use 3",
        key: 51
    },
    FOUR: {
        name: "Use 4",
        key: 52
    },
    FIVE: {
        name: "Use 5",
        key: 53
    },
    SIX: {
        name: "Use 6",
        key: 54
    },
    SEVEN: {
        name: "Use 7",
        key: 55
    },
    EIGHT: {
        name: "Use 8",
        key: 56
    },
    UP: {
        name: "Move Up",
        key: 38
    },
    DOWN: {
        name: "Move Down",
        key: 40
    },
    LEFT: {
        name: "Move Left",
        key: 37
    },
    RIGHT: {
        name: "Move Right",
        key: 39
    },
    LDOWN: {
        name: "Light Down",
        key: 109
    },
    LUP: {
        name: "Light Up",
        key: 107
    },
    WALK: {
        name: "walking (slow)",
        key: 16
    },
    BREAK: {
        name: "Wall Break",
        key: 32
    }
};

preferenceArray = Object.keys(keyPreference).map(function (key) {
    return keyPreference[key];
});

let keyBindGUI = [];
let keyBindButts = [];
let changingID = 0;
let changingKey = false;

function createKeyBindGUI() {
    for (var i = 0; i < preferenceArray.length; i++) {
        var curr = preferenceArray[i];
        var xPos = i < 9 ? 100 : 450;
        var yPos = i < 9 ? 65 + i * 50 : 65 + (i - 9) * 50;
        keyBindGUI.push(new BBText(curr.name, xPos, yPos, 13));
        var tmpButt = createButton(getCharFromCode(curr.key));
        tmpButt.mouseOver(mouseOnButton);
        tmpButt.mouseOut(mouseOutButton);
        tmpButt.size(120, 40);
        tmpButt.id = i;
        tmpButt.mouseClicked(CBChangeKey);
        keyBindButts.push(tmpButt);
    }
}

function getCharFromCode(key) {
    if (key === 38) {
        return "Up";
    }
    if (key === 40) {
        return "Down";
    }
    if (key === 37) {
        return "Left";
    }
    if (key === 39) {
        return "Right";
    }

    if (key === 16) {
        return "Shift";
    }
    if (key === 17) {
        return "Ctrl";
    }
    if (key === 32) {
        return "Space";
    }
    if (key === 13) {
        return "Enter";
    }


    if (key === 109) {
        return "-";
    }
    if (key === 107) {
        return "+";
    }

    if (96 <= key && key <= 105) {
        key -= 48;
    }
    return String.fromCharCode(key);
}

function setKeyBindPos() {
    canvasX = myCanvas.position().x;
    canvasY = myCanvas.position().y;
    for (var i = 0; i < keyBindButts.length; i++) {
        var xPos = i < 9 ? 200 : 550;
        var yPos = i < 9 ? 40 + i * 50 : 40 + (i - 9) * 50;
        keyBindButts[i].position(canvasX + xPos, canvasY + yPos);
    }
}

function CBChangeKey() {
    if (changingKey) {
        keyBindButts[changingID].html(getCharFromCode(preferenceArray[changingID].key));
        keyBindGUI[changingID].color = color('rgb(0,0,0)');
        if (changingID === this.id) {
            changingKey = false;
        } else {
            changingID = this.id;
            changingKey = true;
            keyBindGUI[this.id].color = color('rgb(255,0,0)');
            this.html("Press a Key!");
        }
    } else {
        changingID = this.id;
        changingKey = true;
        keyBindGUI[this.id].color = color('rgb(255,0,0)');
        this.html("Press a Key!");
    }
}

function setChangingFalse() {
    changingKey = false;
    keyBindButts[changingID].html(getCharFromCode(preferenceArray[changingID].key));
    keyBindGUI[changingID].color = color('rgb(0,0,0)');
}

function changeKey(key) {
    var cont = false;
    for (var i = 0; i < preferenceArray.length; i++) {
        if (preferenceArray[i].key == key) {
            cont = true;
            break;
        }
    }
    if (cont) {
        alert("Key " + getCharFromCode(key) + " is already in use!");
    } else {
        preferenceArray[changingID].key = key;
    }
    keyBindButts[changingID].html(getCharFromCode(preferenceArray[changingID].key));
    keyBindGUI[changingID].color = color('rgb(0,0,0)');
}

function loadKeyBindings() {
    for (var i = 0; i < preferenceArray.length; i++) {
        var currKey = getCookie(preferenceArray[i].name);
        if (currKey != "") {
            preferenceArray[i].key = parseInt(currKey);
        }
    }
    changingKey = false;
}

//#endregion

//#region codes

function giveSzabi120() {
    var szabi120 = getCookie("szabi120");
    if (szabi120 == "") {
        maze.player.coins += 120;
        document.cookie = "coin=" + maze.player.coins + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
        document.cookie = "szabi120=" + maze.player.coins + "; expires=Fri, 1 Jan 2121 12:00:00 UTC";
        return true;
    }
    return false;
}
//#endregion