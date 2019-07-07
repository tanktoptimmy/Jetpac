function Alien(img, x, y,alienObject,level,maxX) {
	this.pos = new Vector2(x,y);
	this.vel = new Vector2(0,0);
    this.velX = random(1,2 +(level*0.25));
    var r = random(0,1),
    r2 = random(0,level+1);
    this.velY = r2 * 0.25;
    if(r == 1){
        this.velY = this.velY *-1;
    }

    this.maxX = maxX;//screen width
	this.width = alienObject.width;
	this.height = alienObject.height;
	this.enabled = true;
    this.vel.x = this.velX;
    this.vel.y = this.velY;
    this.bounce = alienObject.bounce || false;
    this.bidirectional = alienObject.bidirectional || false;

    this.img = img;
    this.goingLeftPosX  = (random(0,4) * 68);
    this.goingRightPosX = this.goingLeftPosX + 34;
    this.posX = this.goingRightPosX;
    this.direction = 'pos';

    if(this.bidirectional){
        this.setRandomDirection();
    }

    this.posY = alienObject.y;
	this.connectedEdge = null;
    this.enabled = true;
}


    Alien.prototype.update = function (){
        this.pos.plusEq(this.vel);
    };

    Alien.prototype.render = function(c){
        if(this.enabled){
            c.drawImage(this.img,this.posX,this.posY,this.width,this.height,this.pos.x,this.pos.y,this.width,this.height);
        }
    };

    Alien.prototype.getLeft = function() {
        return this.pos.x;
    };

    Alien.prototype.getRight = function() {
        return this.pos.x+this.width;
    };

    Alien.prototype.getTop = function() {
        return this.pos.y;
    };

    Alien.prototype.getBottom = function () {
        return this.pos.y + this.height;
    };

    Alien.prototype.getHeight = function (){
        return this.height;
    };

    Alien.prototype.getWidth = function (){
        return this.width;
    };

    Alien.prototype.getY = function(){
        return this.pos.y;
    };

    Alien.prototype.getEnabled = function(){
        return this.enabled;
    };

    Alien.prototype.setEnabled = function(enabled){
        this.enabled = enabled;
        if(this.enabled){
            this.vel.x = this.velX;
            this.vel.y = this.velY;
            if(this.bidirectional){
                this.setRandomDirection();
            }else{
                this.posX = this.goingRightPosX;
                this.direction = 'pos';
            }
        }else{
            this.vel.y = this.vel.x = 0;
        }
    };

    Alien.prototype.setMotion = function(y){
        this.pos = new Vector2(this.pos.x,y);
    };

    Alien.prototype.getBounce = function(){
        return this.bounce;
    };

    Alien.prototype.changeDirection = function( yInvert, xInvert){
      if(yInvert){
        this.vel.y *= -1;
      }
      if(xInvert) {
        this.vel.x *= -1;
        this.vel.y *= -1;
        if(this.direction == 'pos'){
          this.direction = 'neg';
          this.posX = this.goingLeftPosX;
        } else {
          this.direction = 'pos';
          this.posX = this.goingRightPosX;
        }
      }
    };

    Alien.prototype.getDirection = function(){
        return this.direction;
    };

    Alien.prototype.setRandomDirection = function(){
        var n = random(0,1);
            if(n === 1){
                this.posX = this.goingLeftPosX;
                this.vel.x *= -1;
                this.direction = 'neg';
                this.pos.x = this.maxX;
            }else{
                this.posX = this.goingRightPosX;
                this.direction = 'pos';
                this.pos.x = 0;
            }
    };

//get random numbers between min & max
function random(min, max){
    return Math.round(((Math.random()*(max-min))  +min));
}
