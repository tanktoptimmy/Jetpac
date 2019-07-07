function Spaceship(ob) {
	
	this.img = ob.img;
	
	this.startsx = this.sx = ob.sx;
	this.startsy = this.sy = ob.sy;
	this.startsheight = this.sHeight = ob.sHeight;
	this.startswidth = this.sWidth = ob.sWidth;
	this.stdx = this.dx	= ob.dx;
	this.startdy = this.dy = ob.dy;
	this.startdwidth = this.dWidth = ob.dWidth;
	this.startdheight = this.dHeight = ob.dHeight;
	this.draggable = ob.draggable;
	this.pickedUp = false;
	this.released = false;
	this.connected = false;
	this.enabled = true;
}


Spaceship.prototype.setEnabled = function(e){
	this.enabled = e;
};

Spaceship.prototype.setDraggable = function(d){
	this.draggable = d;
};

Spaceship.prototype.getDraggable = function(){
	return this.draggable;
};

Spaceship.prototype.setPickedUp = function(p){
	this.pickedUp = p;
};

Spaceship.prototype.getPickedUp = function(){
	return this.pickedUp;
};

Spaceship.prototype.setReleased = function(r){
	this.released = r;
};

Spaceship.prototype.getReleased = function(){
	return this.released;
};

Spaceship.prototype.getLeft = function() {
	return this.dx;
};

Spaceship.prototype.getRight = function() {
	return this.dx + this.dWidth;
};

Spaceship.prototype.getTop = function() {
	return this.dy;
};

Spaceship.prototype.getBottom = function () {
	return this.dy + this.dHeight;
};

Spaceship.prototype.getHeight = function() {
	return this.dHeight;
};

Spaceship.prototype.setHeight = function(){
	
};

Spaceship.prototype.setX = function(p){
	this.dx = p;
};

Spaceship.prototype.setY = function(p){
	this.dy = p;
};

Spaceship.prototype.getY = function(){
	return this.dy;
};

Spaceship.prototype.setConnected = function(c){
	this.connected = c;
};

Spaceship.prototype.getConnected = function(){
	return this.connected;
};

Spaceship.prototype.changeHeight = function(d){
		this.sy = this.sy - d;
		this.sHeight = this.sHeight + d;
		this.dy = this.dy - d;
		this.dHeight = this.dHeight + d;
};

Spaceship.prototype.reset = function(){
	this.sy = this.startsy;
	this.sHeight = this.startsheight;
	this.dy = this.startdy;
	this.dHeight = this.startdheight;
};

Spaceship.prototype.render = function(c){
	if(this.enabled){
		return c.drawImage(this.img,this.sx,this.sy,this.sWidth,this.sHeight,this.dx,this.dy,this.dWidth,this.dHeight);
	}
};
