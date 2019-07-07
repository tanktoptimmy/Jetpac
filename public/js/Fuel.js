function Fuel(ob) {

	
	this.img = ob.img;
	this.sx = ob.sx;
	this.sy = ob.sy;
	this.sHeight= ob.sHeight;
	this.sWidth	= ob.sWidth;
	this.dx	= ob.dx;
	this.dy	= ob.dy;
	this.dWidth	= ob.dWidth;
	this.dHeight	= ob.dHeight;
	this.draggable = ob.draggable;
	this.pickedUp = false;
	this.released = true;
	this.connected = false;
	this.enabled = true;
}


Fuel.prototype.setEnabled = function(e){
	this.enabled = e;
};

Fuel.prototype.setDraggable = function(d){
	this.draggable = d;
};

Fuel.prototype.getDraggable = function(){
	return this.draggable;
};

Fuel.prototype.setPickedUp = function(p){
	this.pickedUp = p;
};

Fuel.prototype.getPickedUp = function(){
	return this.pickedUp;
};

Fuel.prototype.setReleased = function(r){
	this.released = r;
};

Fuel.prototype.getReleased = function(){
	return this.released;
};

Fuel.prototype.getLeft = function() {
	return this.dx;
};

Fuel.prototype.getRight = function() {
	return this.dx + this.dWidth;
};

Fuel.prototype.getTop = function() {
	return this.dy;
};

Fuel.prototype.getBottom = function () {
	return this.dy + this.dHeight;
};

Fuel.prototype.getHeight = function() {
	return this.dHeight;
};

Fuel.prototype.setX = function(p){
	this.dx = p;
};

Fuel.prototype.setY = function(p){
	this.dy = p;
};

Fuel.prototype.setConnected = function(c){
	this.connected = c;
};

Fuel.prototype.getConnected = function(){
	return this.connected;
};

Fuel.prototype.render = function(c){
	return c.drawImage(this.img,this.sx,this.sy,this.sWidth,this.sHeight,this.dx,this.dy,this.dWidth,this.dHeight);
};