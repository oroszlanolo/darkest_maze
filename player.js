let Direction={
    Up : 0,
    Right : 1,
    Down : 2,
    Left : 3
}
class Player{
    constructor(x,y, lRange = 140, energy = 100, coins = 0){
        this.x = x;
        this.y = y;
        this.xDir = 0;
        this.yDir = 0;
        this.lightAdjust = 0;
        this.walkSpeed = 1;
        this.speed = 2;
        this.walking = false;
        this.size = playerW;
        this.halfSize = this.size / 2;
        this.direction = Direction.Down;

        this.maxLRange = this.lightRange = lRange;
        this.coins = coins;
        this.coinMult = 1;
        this.maxEnergy = this.energy = energy;
        this.baseEnergyConsumption = 0.005;
        this.moveEnergyConsumption = 0.02;
    }
    giveCoins(n){
        this.coins += this.coinMult*n;
    }
    reset(x,y){
        this.x = x;
        this.y = y;
        this.xDir = 0;
        this.yDir = 0;
        this.lightAdjust = 0;
        this.direction = Direction.Down;
        this.energy = this.maxEnergy;
    }
    move(){
        if(this.energy == 0){
            return;
        }
        this.energyConsume(this.baseEnergyConsumption*this.lightRange/100);
        if(this.xDir != 0){
            this.energyConsume(this.moveEnergyConsumption);
        }
        if(this.yDir != 0){
            this.energyConsume(this.moveEnergyConsumption);
        }
        if(this.lightAdjust > 0){
            this.lightUp();
        }else if(this.lightAdjust < 0){
            this.lightDown();
        }

        var prevX = this.x;
        var prevY = this.y;
        if(this.walking){
            this.x += this.xDir * this.walkSpeed;
        }else{
            this.x += this.xDir * this.speed;
        }
        if(this.crash()){
            this.x = prevX;
            this.energy += this.moveEnergyConsumption;
        }
        if(this.walking){
            this.y -= this.yDir * this.walkSpeed;
        }else{
            this.y -= this.yDir * this.speed;
        }
        if(this.crash()){
            this.y = prevY;
            this.energy += this.moveEnergyConsumption;
        }
    }
    lightUp(){
        if(this.lightRange >= this.maxLRange){
            return;
        }
        this.lightRange += 4;
        if(this.lightRange > this.maxLRange){
            this.lightRange = this.maxLRange;
        }
        createCircle();
    }
    lightDown(){
        if(this.lightRange <= this.playerW){
            return;
        }
        this.lightRange -= 4;
        if(this.lightRange < this.playerW){
            this.lightRange = this.playerW;
        }
        createCircle();
        
    }
    energyConsume(energy){
        if(this.energy == 0){
            return;
        }
        this.energy -= energy;
        if(this.energy < 0){
            this.energy = 0;
        }
    }
    crash(){
        for(var walltmp of walls){
            if(walltmp.crash(this.x,this.y,this.halfSize)){
                return true;
            }
        }
        return false;
    }
    draw(){
        fill(0,0,255);
        stroke(0,0,255);
        rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}