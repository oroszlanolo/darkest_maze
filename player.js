let Direction = {
    Up: 0,
    UpRight: 1,
    Right: 2,
    DownRight: 3,
    Down: 4,
    DownLeft: 5,
    Left: 6,
    UpLeft: 7
}
class Player {
    constructor(x, y, width, lRange = 140, energy = 200, coins = 0, ) {
        this.buffs = {
            lightRange: {
                active: false,
                start: 0,
                time: 0,
                value: 0,
            },
            coinMult: {
                active: false,
                start: 0,
                time: 0
            }
        }
        this.x = x;
        this.y = y;
        this.xDir = 0;
        this.yDir = 0;
        this.direction = 1;
        this.lightAdjust = 0;
        this.walkSpeed = 1;
        this.speed = 2;
        this.walking = false;
        this.size = width;
        this.halfSize = this.size / 2;
        this.direction = Direction.Down;
        this.color = color("rgb(200,0,255)");

        this.maxLRange = this.lightRange = lRange;
        this.coins = coins;
        this.coinMult = 1;
        this.breakConsume = 30;
        this.maxEnergy = this.energy = energy;
        this.baseEnergyConsumption = 0.005;
        this.moveEnergyConsumption = 0.02;

        this.items = [];
    }
    giveEnergy(n) {
        this.energy += n;
        if (this.energy > this.maxEnergy) {
            this.energy = this.maxEnergy;
        }
    }
    setDir(x, y) {
        this.xDir += x;
        this.yDir += y;
        if (this.xDir == 1) {
            this.direction = 2;
            if (this.yDir == 1) {
                this.direction = 1;
            }
            if (this.yDir == -1) {
                this.direction = 3;
            }
        }
        if (this.xDir == -1) {
            this.direction = 6;
            if (this.yDir == 1) {
                this.direction = 7;
            }
            if (this.yDir == -1) {
                this.direction = 5;
            }
        }
        if (this.xDir == 0) {
            if (this.yDir == -1) {
                this.direction = 4;
            } else if (this.yDir == 1) {
                this.direction = 0;
            }
        }
    }
    useItem(n) {
        if (n < 0 || n > this.items.length) {
            return;
        }
        if (this.items[n].quant < 1 || !this.items[n].processable()) {
            return;
        }
        this.items[n].quant--;
        this.items[n].process();
        shopGUI[n * 2 + 1].text = myPlayer.items[n].quant + " pcs";
    }
    giveCoins(n) {
        this.coins += this.coinMult * n;
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.xDir = 0;
        this.yDir = 0;
        this.lightAdjust = 0;
        this.direction = Direction.Down;
        this.energy = this.maxEnergy;
    }
    checkBuffs() {
        if (this.buffs.lightRange.active && this.buffs.lightRange.time < millis()) {
            this.buffs.lightRange.active = false;
            this.maxLRange -= this.buffs.lightRange.value;
            this.lightRange = this.maxLRange;
            createCircle();
        }
        if (this.buffs.coinMult.active && this.buffs.coinMult.time < millis()) {
            this.buffs.coinMult.active = false;
            this.coinMult /= 2;
        }
    }
    move(zoom) {
        this.checkBuffs();
        if (this.energy == 0) {
            return;
        }
        this.energyConsume(this.baseEnergyConsumption * this.lightRange / 100);
        if (this.xDir != 0) {
            this.energyConsume(this.moveEnergyConsumption);
        }
        if (this.yDir != 0) {
            this.energyConsume(this.moveEnergyConsumption);
        }
        if (this.lightAdjust > 0) {
            this.lightUp();
        } else if (this.lightAdjust < 0) {
            this.lightDown();
        }

        var prevX = this.x;
        var prevY = this.y;
        if (this.walking) {
            this.x += this.xDir * this.walkSpeed * zoom;
        } else {
            this.x += this.xDir * this.speed * zoom;
        }
        if (this.crash()) {
            this.x = prevX;
            this.energy += this.moveEnergyConsumption;
        }
        if (this.walking) {
            this.y -= this.yDir * this.walkSpeed * zoom;
        } else {
            this.y -= this.yDir * this.speed * zoom;
        }
        if (this.crash()) {
            this.y = prevY;
            this.energy += this.moveEnergyConsumption;
        }
        return createVector(this.x - prevX, this.y - prevY);
    }
    lightUp() {
        if (this.lightRange >= this.maxLRange) {
            return;
        }
        this.lightRange += 10;
        if (this.lightRange > this.maxLRange) {
            this.lightRange = this.maxLRange;
        }
        // createCircle();
    }
    lightDown() {
        if (this.lightRange <= 20) {
            return;
        }
        this.lightRange -= 10;
        if (this.lightRange < 20) {
            this.lightRange = 20;
        }
        // createCircle();

    }
    energyConsume(energy) {
        if (this.energy == 0) {
            return;
        }
        this.energy -= energy;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }
    crash() {
        for (var walltmp of maze.walls) {
            if (walltmp.crash(this.x, this.y, this.halfSize)) {
                return true;
            }
        }
        return false;
    }
    breakWall() {
        if (this.breakConsume > this.energy) {
            return;
        }
        var x = this.x;
        var y = this.y;
        switch (this.direction) {
            case 0:
                y -= this.size / 2;
                break;
            case 4:
                y += this.size / 2;
                break;
            case 6:
                x -= this.size / 2;
                break;
            case 2:
                x += this.size / 2;
        }
        var success = false;
        for (var i = 0; i < maze.walls.length; i++) {
            if (maze.walls[i].crash(x, y, this.size / 4) && maze.walls[i].destroyable) {
                maze.walls.splice(i, 1);
                success = true;
                break;
            }
        }
        if (success) {
            this.energy -= this.breakConsume;
        }
        maze.updatePic();
    }
    draw(offX, offY, n) {

        if (n == 0) {
            image(robotImg, this.x - this.size / 2 + offX, this.y - this.size / 2 + offY, this.size, this.size);
            return;
        }
        push();
        translate(this.x + offX, this.y + offY);
        rotate(PI);
        rotate(PI / 4 * this.direction);
        switch (n) {
            case 1:
                fill(this.color);
                stroke(this.color);
                rect(-this.size / 2, -this.size / 2, this.size, this.size);
                stroke(255, 0, 0);
                line(0, 0, 0, this.size / 2);
                break;
            case 2:
                stroke(0, 0, 0);
                fill(0);
                triangle(4 - this.size / 2, this.size / 2 - 6, 0, this.size / 2, this.size / 2 - 3, this.size / 2 - 6);
                fill(this.color);
                stroke(this.color);
                rect(2 - this.size / 2, -this.size / 2, this.size - 4, this.size - 6);
                break;
            case 3:
                fill(this.color);
                stroke(this.color);
                triangle(1 - this.size / 2, -this.size / 2, 0, this.size / 2, this.size / 2 - 1, -this.size / 2);
                break;
            case 4:
                fill(this.color);
                stroke(this.color);
                ellipse(0, 0, this.size);
                fill(255, 0, 0);
                stroke(255, 0, 0);
                strokeWeight(2);
                line(0, 0, 0, this.size / 2);

        }
        pop();
    }
}