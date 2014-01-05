function Bonus(ob) {

	this.img = ob.img;
	this.falling = false;
	this.count = 0;
	this.enabled = false;
	this.sx = null;
	this.sy = null;
	this.sWidth = null;
	this.sHeight = null;
	this.dx = null;
	this.dy = null;
	this.dWidth = null;
	this.dHeight = null;


	this.update = function() {
       if(this.count < 7){
            this.count++;
        }else{
            this.count = 0;
        }
	};
	
	this.render = function(c){
		if(this.enabled){
			var xNum = (this.count%9) * this.sWidth;
			return c.drawImage(this.img,xNum,this.sy,this.sWidth,this.sHeight,this.dx,this.dy,this.dWidth,this.dHeight);
		}
	};
	
	this.setEnabled = function(e){
		this.enabled = e;
	};
	
	this.getEnabled = function(){
		return this.enabled;
	};
	
	this.getLeft = function() {
		return this.dx;
	};
	
	this.getRight = function() {
		return this.dx+this.sWidth;
	};

	this.getTop = function() {
		return this.dy;
	};
	
	this.getBottom = function () {
		return this.dy;
	};

	this.getHeight = function () {
		return this.sHeight;
	};
}

Bonus.prototype.setY = function (pos){
	this.dy = pos;
}

Bonus.prototype.setupBonus = function (ob){
	this.sx = ob.sx;
	this.sy = ob.sy;
	this.sWidth = this.dWidth =ob.sWidth;
	this.sHeight = this.dHeight = ob.sHeight;
	this.dx = this.random(0,400);
	this.dy = 70;
	this.enabled = true;
	this.falling = true;
};

Bonus.prototype.setFalling = function(c){
	this.falling = c;
};

Bonus.prototype.getFalling = function(){
	return this.falling;
};

Bonus.prototype.random = function(min, max){
	return Math.round(((Math.random()*(max-min))  +min));
};