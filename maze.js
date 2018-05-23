let Alignment={
    Vert : 0,
    Hor : 1
}

class Wall{
    constructor(x,y,alig,destroyable = true){
        this.xx = x;
        this.yy = y;
        this.x = x * (spaceW+wallW);
        this.y = y * (spaceW+wallW);
        this.alig = alig;
        this.destroyable = destroyable;
        if(this.alig == Alignment.Vert){
            this.h = spaceW + wallW *2;
            this.w = wallW;
        }else{
            this.w = spaceW + wallW *2;
            this.h = wallW;
        }
    }

    draw(myImg){
        let rVal = this.destroyable? 10 : 110;
        if(myImg){
        myImg.fill(rVal,10,10);
        myImg.stroke(rVal,10,10);
        myImg.noSmooth();
        myImg.rect(this.x,this.y,this.w,this.h);
        }else{
            fill(rVal,10,10);
            stroke(rVal,10,10);
            noSmooth();
            rect(this.x,this.y,this.w,this.h);
        }
    }
    crash(x,y,r){
        if((x > this.x - r) && (x < this.x + this.w + r)){
            if((y > this.y - r) && (y < this.y + this.h + r)){
                return true;
            }
        }
        return false;
    }
}