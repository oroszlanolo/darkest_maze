class Coin{
    constructor(x, y){
        this.xx = x;
        this.yy = y;
        this.x = (spaceW + wallW) * x + wallW + (spaceW / 2);
        this.y = (spaceW + wallW) * y + wallW + (spaceW / 2);
        this.r = (spaceW - 6) / 2;
    }
    draw(imtToDraw){
        imtToDraw.fill(250,180,0);
        imtToDraw.stroke(100,80,0);
        // imtToDraw.ellipse(this.x-this.r,this.y-this.r,2*this.r,2*this.r);
        imtToDraw.ellipse(this.x,this.y,2*this.r,2*this.r);
    }
    crash(p){
        return (abs(this.x-p.x) < (p.halfSize + this.r) && abs(this.y-p.y) < (p.halfSize + this.r))
    }
}