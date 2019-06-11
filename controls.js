function keyPressed() {
    if (changingKey) {
        changeKey(keyCode);
        changingKey = false;
        return false;
    }
    if (gameState == gameSt.Dungeon) {
        inDungeonKeyDown();
    }
}

function keyReleased() {
    if (gameState == gameSt.Dungeon) {
        inDungeonKeyUp();
    }
}

function keyTyped() {
    if (gameState == gameSt.Dungeon) {
        inDungeonKeyTyped();
    }
    if (gameState == gameSt.MMenu) {
        if (keyCode == keyPreference.BREAK.key) {
            CBNewDungeon();
        }
    }
}

function inDungeonKeyDown() {
    switch (keyCode) {
        case keyPreference.UP.key:
            maze.player.setDir(0, 1);
            break;
        case keyPreference.RIGHT.key:
            maze.player.setDir(1, 0);
            break;
        case keyPreference.DOWN.key:
            maze.player.setDir(0, -1);
            break;
        case keyPreference.LEFT.key:
            maze.player.setDir(-1, 0);
            break;
        case keyPreference.LUP.key:
            maze.player.lightAdjust++;
            break;
        case keyPreference.LDOWN.key:
            maze.player.lightAdjust--;
            break;
        case keyPreference.WALK.key:
            maze.player.walking = true;
            break;
    }
}

function inDungeonKeyUp() {
    switch (keyCode) {
        case keyPreference.UP.key:
            maze.player.setDir(0, -1);
            break;
        case keyPreference.RIGHT.key:
            maze.player.setDir(-1, 0);
            break;
        case keyPreference.DOWN.key:
            maze.player.setDir(0, 1);
            break;
        case keyPreference.LEFT.key:
            maze.player.setDir(1, 0);
            break;
        case keyPreference.LUP.key:
            maze.player.lightAdjust--;
            break;
        case keyPreference.LDOWN.key:
            maze.player.lightAdjust++;
            break;
        case keyPreference.WALK.key:
            maze.player.walking = false;
            break;
        case keyPreference.BREAK.key:
            if (maze.player.energy > 0.1) {
                maze.player.breakWall();
            } else {
                CBMMenu();
            }
            break;
    }
}

function inDungeonKeyTyped() {
    switch (keyCode) {
        case keyPreference.ZERO.key:
            maze.player.useItem(0);
            break;
        case keyPreference.ONE.key:
            maze.player.useItem(1);
            break;
        case keyPreference.TWO.key:
            maze.player.useItem(2);
            break;
        case keyPreference.TREE.key:
            maze.player.useItem(3);
            break;
        case keyPreference.FOUR.key:
            maze.player.useItem(4);
            break;
        case keyPreference.FIVE.key:
            maze.player.useItem(5);
            break;
        case keyPreference.SIX.key:
            maze.player.useItem(6);
            break;
        case keyPreference.SEVEN.key:
            maze.player.useItem(7);
            break;
        case keyPreference.EIGHT.key:
            maze.player.useItem(8);
            break;
    }
}