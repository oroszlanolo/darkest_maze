let Alignment = {
    Vert: 0,
    Hor: 1
}

class Wall {
    constructor(x, y, alig, destroyable = true, wallW, spaceW) {
        this.spaceW = spaceW;
        this.wallW = wallW;
        this.xx = x;
        this.yy = y;
        this.x = x * (spaceW + wallW);
        this.y = y * (spaceW + wallW);
        this.alig = alig;
        this.destroyable = destroyable;
        if (this.alig == Alignment.Vert) {
            this.h = spaceW + wallW * 2;
            this.w = wallW;
        } else {
            this.w = spaceW + wallW * 2;
            this.h = wallW;
        }
    }

    draw(myImg) {
        let rVal = this.destroyable ? 10 : 110;
        if (myImg) {
            myImg.fill(rVal, 10, 10);
            myImg.stroke(rVal, 10, 10);
            myImg.noSmooth();
            myImg.rect(this.x, this.y, this.w, this.h);
        } else {
            fill(rVal, 10, 10);
            stroke(rVal, 10, 10);
            noSmooth();
            rect(this.x, this.y, this.w, this.h);
        }
    }
    crash(x, y, r) {
        if ((x > this.x - r) && (x < this.x + this.w + r)) {
            if ((y > this.y - r) && (y < this.y + this.h + r)) {
                return true;
            }
        }
        return false;
    }
}

class Maze {
    constructor(cols, rows, wallW, spaceW, playerW, simplicity, zoom) {
        this.offX = 0;
        this.offY = 0;
        this.cols = cols;
        this.rows = rows;
        this.zoom = zoom;
        this.wallW = wallW * zoom;
        this.spaceW = spaceW * zoom;
        this.playerW = playerW * zoom;
        this.simplicity = simplicity;
        this.actualW = (spaceW + wallW) * cols + wallW;
        this.actualH = (spaceW + wallW) * rows + wallW;
        this.w = (this.spaceW + this.wallW) * cols + this.wallW;
        this.h = (this.spaceW + this.wallW) * rows + this.wallW;
        this.roomNum = 0;
        this.coinNum = 10;

        this.img = createGraphics(this.w, this.h);
        this.walls = [];
        this.coins = [];

        this.player = null;
    }

    reset() {
        this.player.reset(this.wallW + this.playerW / 2, this.wallW + this.playerW / 2);
        this.generate();
        this.offX = 0;
        this.offY = 0;
    }

    generate() {
        let mazeGenerator = new MazeGenerator(this.cols, this.rows, this.wallW, this.spaceW, this.simplicity, this.coinNum);
        this.setRooms(mazeGenerator);
        this.walls = mazeGenerator.makeNewMaze();
        this.coins = mazeGenerator.coins;
        this.updatePic();
    }
    setRooms(mazeGenerator) {
        mazeGenerator.rooms = [];
        for (var i = 0; i < this.roomNum; i++) {
            mazeGenerator.addRoom(floor(random(3, 6.5)), floor(random(3, 6.5)));
        }
    }
    movePlayer() {
        var vec = this.player.move(this.zoom);
        if (!vec) {
            return;
        }
        if (vec.x > 0 &&
            this.offX + this.w - vec.x >= actualW &&
            this.player.x + this.offX >= actualW / 3 * 2) {
            this.offX -= vec.x;
        }
        if (vec.x < 0 &&
            this.offX + vec.x < 0 &&
            this.player.x + this.offX <= actualW / 3) {
            this.offX -= vec.x;
        }
        if (vec.y > 0 &&
            this.offY + this.h - vec.y >= actualH &&
            this.player.y + this.offY >= actualH / 3 * 2) {
            this.offY -= vec.y;
        }
        if (vec.y < 0 &&
            this.offY + vec.y < 0 &&
            this.player.y + this.offY <= actualH / 3) {
            this.offY -= vec.y;
        }
        this.reachCoin();
    }
    reachCoin() {
        for (var c of this.coins) {
            if (c.crash(this.player)) {
                this.removeCoin(c);
                this.player.giveCoins(c.value);
            }
        }
    }

    removeCoin(c) {
        for (let i = 0; i < this.coins.length; i++) {
            if (c.x == this.coins[i].x && c.y == this.coins[i].y) {
                this.coins.splice(i, 1);
                this.updatePic();
                return;
            }
        }
    }

    updatePic() {
        this.drawWalls();
        this.drawCoins();
    }
    drawWalls() {
        this.img.background(255);
        for (var w of this.walls) {
            if (w.destroyable) {
                w.draw(this.img);
            }
        }
        for (var w of this.walls) {
            if (!w.destroyable) {
                w.draw(this.img);
            }
        }
    }

    drawCoins() {
        for (var c of this.coins) {
            c.draw(this.img);
        }
    }

    draw(lighted = false) {
        image(this.img, this.offX, this.offY);
        if (lighted) {
            return;
        }
        var x = this.player.x;
        var y = this.player.y;
        var lightRange = floor(this.player.lightRange * this.zoom);
        if (cirks[lightRange] == null) {
            createCirk(lightRange);
        }
        var xPos = x - cirks[lightRange].width / 2 + floor(this.offX);
        var yPos = y - cirks[lightRange].height / 2 + floor(this.offY);
        image(cirks[lightRange], xPos, yPos);
        fill(0);
        stroke(0);
        if (xPos > 0) {
            rect(0, 0, ceil(xPos), this.h);
        }
        if (yPos > 0) {
            rect(0, 0, this.w, ceil(yPos));
        }
        if (xPos + cirks[lightRange].width < this.w) {
            rect(xPos + floor(cirks[lightRange].width), 0, this.w, this.h);
        }
        if (yPos + cirks[lightRange].height < this.h) {
            rect(0, yPos + floor(cirks[lightRange].height), this.w, this.h);
        }
        this.player.draw(this.offX, this.offY, parseInt(graphSelect.value()));
        if (this.player.energy <= 0.1) {
            fill(0, 0, 0, 100);
            rect(0, 0, actualW, actualH);
            textAlign(CENTER);
            textSize(30);
            fill(255);
            stroke(100);
            text("Press " + getCharFromCode(keyPreference.BREAK.key), actualW / 2, actualH / 2);
            textAlign(LEFT);
        }
    }
}

class DecorMaze extends Maze {
    constructor(cols, rows, wallW, spaceW, playerW, simplicity, canvCols, canvRows) {
        super(cols, rows, wallW, spaceW, playerW, simplicity, 1.5);
        this.overW = this.w - (this.spaceW + this.wallW) * canvCols + this.wallW;
        this.overH = this.h - (this.spaceW + this.wallW) * canvRows + this.wallW;
        this.randomize();
    }
    draw() {
        super.draw(true);
    }
    updatePos() {
        this.offX += this.velX;
        this.offY += this.velY;
        if (this.offX > 0 || this.offY > 0 ||
            this.offX < -this.overW || this.offY < -this.overH) {
            this.randomize();
        }
    }
    randomize() {
        this.roomNum = floor(random(4, 12));
        this.coinNum = floor(random(30, 100));
        this.generate();
        this.offX = random(-this.overW, 0);
        this.offY = random(-this.overH, 0);
        this.velX = random(0.1, 0.5);
        if (random(-1, 1) < 0) {
            this.velX *= -1;
        }
        this.velY = random(-0.5, 0.5);
        if (random(-1, 1) < 0) {
            this.velY *= -1;
        }
    }
}