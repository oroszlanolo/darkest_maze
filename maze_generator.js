class Space {
    constructor(x, y, mazeCols, mazeRows) {
        this.x = x;
        this.y = y;
        this.sides = 4;
        if (this.x == 0 || this.x == mazeCols - 1) {
            this.sides--;
        }
        if (this.y == 0 || this.y == mazeRows - 1) {
            this.sides--;
        }
        this.visited = false;
        this.hasCoin = false;
    }
    visit() {
        if (this.visited) {
            print("Error!");
        }
        this.visited = true;
        if (this.left) {
            this.left.sides--;
        }
        if (this.up) {
            this.up.sides--;
        }
        if (this.down) {
            this.down.sides--;
        }
        if (this.right) {
            this.right.sides--;
        }
    }

}

class Room {
    constructor(x, y, w, h, mazeCols, mazeRows) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mazeCols = mazeCols;
        this.mazeRows = mazeRows;
    }
    randomize() {
        this.x = floor(random(this.mazeCols - this.w));
        this.y = floor(random(this.mazeRows - this.h));
    }
    valid() {
        if (this.w <= 0 || this.h <= 0) {
            return false;
        }
        if (this.x == 0 && this.y == 0) {
            return false;
        }
        return (this.x >= 0 &&
            this.y >= 0 &&
            this.x <= this.mazeCols - this.w &&
            this.y <= this.mazeRows - this.h);
    }
    crash(other) {
        return !(this.x + this.w < other.x ||
            this.y + this.h < other.y ||
            other.x + other.w < this.x ||
            other.y + other.h < this.y);
    }
}

class MazeGenerator {
    constructor(mazeCols, mazeRows, wallWidth, spaceWidth, simplity, coins) {
        this.spaceArr = [];
        this.maze = [];
        this.road = [];
        this.rooms = [];
        this.coins = [];

        this.setParams(mazeCols, mazeRows, wallWidth, spaceWidth, simplity, coins);
    }

    setParams(mazeCols, mazeRows, wallWidth, spaceWidth, simplity, coins) {
        this.mazeCols = mazeCols;
        this.mazeRows = mazeRows;
        this.wallW = wallWidth;
        this.spaceW = spaceWidth;
        this.simplicity = simplity;
        this.coinCount = coins;
    }

    addRoom(w, h) {
        this.rooms.push(new Room(0, 0, w, h, this.mazeCols, this.mazeRows));
    }
    removeRoom(w, h) {
        if (!w || !h) {
            this.rooms.pop();
            return;
        }

        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].w == w && this.rooms[i].h == h) {
                this.rooms.splice(i, 1);
                return;
            }
        }
    }
    clearRooms() {
        this.rooms = [];
    }

    makeNewMaze() {
        let safety = 0
        while (safety < 100) {
            safety++;
            this.spaceArr = [];
            this.maze = [];
            this.road = [];
            this.createSpaceArr();
            this.createFullMaze();
            if (!this.makeRooms()) {
                continue;
            }
            this.generateCoins();
            this.clearRooms();
            if (this.generateMaze()) {
                break;
            }
        }
        if (safety >= 100) {
            print("Safety guard reached in makeNewMaze");
        }
        this.simplify(this.simplicity);
        return this.maze;
    }

    generateCoins() {
        this.coins = [];
        let safety = 200;
        let coinsToMake = this.coinCount;
        this.generateCoinToRooms();
        while (coinsToMake > 0 && safety > 0) {
            safety--;
            let xPos = floor(random(0, this.mazeCols));
            let yPos = floor(random(0, this.mazeRows));
            if (!this.spaceArr[yPos][xPos].visited && !this.spaceArr[yPos][xPos].hasCoin) {
                this.coins.push(new Coin(xPos, yPos, this.wallW, this.spaceW));
                this.spaceArr[yPos][xPos].hasCoin = true;
                coinsToMake--;
            }
        }
    }
    generateCoinToRooms() {
        for (var i = 0; i < this.rooms.length; i++) {
            var r = this.rooms[i];
            for (var j = r.y; j < r.y + r.h; j++) {
                for (var k = r.x; k < r.x + r.w; k++) {
                    if (0.5 > random()) {
                        this.coins.push(new Coin(k, j, this.wallW, this.spaceW));
                    }
                }
            }
        }
    }

    makeRooms() {
        for (let i = 0; i < this.rooms.length; i++) {
            let validRoom = false;
            let safety = 0;
            while (!validRoom && safety < 1000) {
                this.rooms[i].randomize();
                validRoom = this.rooms[i].valid();
                for (let j = 0; j < i; j++) {
                    if (this.rooms[i].crash(this.rooms[j])) {
                        validRoom = false;
                    }
                }
                ++safety;
            }
            if (safety >= 1000) {
                return false;
            }
        }
        return true;
    }

    clearRooms() {
        for (let room of this.rooms) {
            this.clearRoom(room);
        }
    }

    clearRoom(room) {
        for (let i = room.x; i < room.x + room.w; i++) {
            for (let j = room.y; j <= room.y + room.h; j++) {
                this.removeWall(i, j, i + 1, j);
            }
        }
        for (let i = room.x; i <= room.x + room.w; i++) {
            for (let j = room.y; j < room.y + room.h; j++) {
                this.removeWall(i, j, i, j + 1);
            }
        }
        for (let i = room.x; i <= room.x + room.w; i++) {
            for (let j = room.y; j <= room.y + room.h; j++) {
                this.spaceArr[j][i].visit()
            }
        }
        let safety = 0;
        while (safety < 1000) {
            let x1, x2, y1, y2;
            if (random(1) < 0.5) {
                //vertical
                y1 = floor(random(room.y, room.y + room.h + 1));
                y2 = y1;
                if (random(1) < 0.5) {
                    x1 = room.x;
                    x2 = x1 - 1;
                } else {
                    x1 = room.x + room.w;
                    x2 = x1 + 1;
                }
            } else {
                //horizontal
                x1 = floor(random(room.x, room.x + room.w + 1));
                x2 = x1;
                if (random(1) < 0.5) {
                    y1 = room.y;
                    y2 = y1 - 1;
                } else {
                    y1 = room.y + room.h;
                    y2 = y1 + 1;
                }
            }
            if (this.removeWall(x1, y1, x2, y2)) {
                break;
            } else {
                continue;
            }
        }
    }


    removeWall(x1, y1, x2, y2) {
        if (x1 == x2) {
            //same col
            let y = max(y1, y2);
            return this.deleteWall(x1, y, Alignment.Hor);
        } else {
            //same row
            let x = max(x1, x2);
            return this.deleteWall(x, y1, Alignment.Vert);
        }
    }

    deleteWall(x, y, alig) {
        for (let i = 0; i < this.maze.length; i++) {
            if (this.eqWall(this.maze[i], x, y, alig) && this.maze[i].destroyable) {
                this.maze.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    eqWall(wall, x, y, alig) {
        return (wall.xx == x && wall.yy == y && wall.alig == alig);
    }


    createFullMaze() {
        for (var i = 0; i <= this.mazeRows; i++) {
            for (var j = 0; j <= this.mazeCols; j++) {
                if (i < this.mazeRows) {
                    let destable = (j == 0 || j == this.mazeCols);
                    this.maze.push(new Wall(j, i, Alignment.Vert, !destable, this.wallW, this.spaceW));
                }
                if (j < this.mazeCols) {
                    let destable = (i == 0 || i == this.mazeRows);
                    this.maze.push(new Wall(j, i, Alignment.Hor, !destable, this.wallW, this.spaceW));
                }
            }
        }
    }

    createSpaceArr() {
        this.spaceArr = [];
        for (var i = 0; i < this.mazeRows; i++) {
            var arrTmp = [];
            for (var j = 0; j < this.mazeCols; j++) {
                arrTmp[j] = new Space(j, i, this.mazeCols, this.mazeRows);
            }
            this.spaceArr[i] = arrTmp;
        }
        for (var i = 0; i < this.mazeRows; i++) {
            for (var j = 0; j < this.mazeCols; j++) {
                let spaceTmp = this.spaceArr[i][j];
                if (i > 0) {
                    spaceTmp.up = this.spaceArr[i - 1][j];
                }
                if (i < this.mazeRows - 1) {
                    spaceTmp.down = this.spaceArr[i + 1][j];
                }
                if (j > 0) {
                    spaceTmp.left = this.spaceArr[i][j - 1];
                }
                if (j < this.mazeCols - 1) {
                    spaceTmp.right = this.spaceArr[i][j + 1];
                }
            }
        }
    }

    //The main algorithm with random DFS
    generateMaze() {
        let remaining = this.mazeCols * this.mazeRows - 1;
        this.road.push(this.spaceArr[0][0]);
        this.spaceArr[0][0].visit();
        while (this.road.length > 0) {
            let current = this.road[this.road.length - 1];
            let sides = current.sides;
            if (sides > 0) {
                let nextSpace;
                let safety = 0;
                while (!nextSpace) {
                    safety++;
                    let choose = floor(random(4));
                    switch (choose) {
                        case 0:
                            if (current.up && !current.up.visited) {
                                nextSpace = current.up;
                            }
                            break;
                        case 1:
                            if (current.down && !current.down.visited) {
                                nextSpace = current.down;
                            }
                            break;
                        case 2:
                            if (current.left && !current.left.visited) {
                                nextSpace = current.left;
                            }
                            break;
                        case 3:
                            if (current.right && !current.right.visited) {
                                nextSpace = current.right;
                            }
                            break;
                    }
                    if (safety > 200) {
                        return;
                    }
                }
                this.removeWall(current.x, current.y, nextSpace.x, nextSpace.y);
                nextSpace.visit();
                this.road.push(nextSpace);
                remaining--;
            } else {
                this.road.pop();
            }
        }
        for (let spcarr of this.spaceArr) {
            for (let spc of spcarr) {
                if (!spc.visited) {
                    return false;
                }
            }
        }
        return true;
    }

    //if you want to make a more simple maze, then call this, and this will remove n random wall from the this.maze
    simplify(n) {
        let i = 0;
        let safety = 0;
        while (i < n && safety < 1000) {
            let index = floor(random(this.maze.length));
            if (this.maze[index].destroyable) {
                this.maze.splice(index, 1);
                i++;
            }
            safety++;
        }
    }
}