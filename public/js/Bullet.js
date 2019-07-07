Bullet = function(x, y, direction) {
	//@TODO reuse setup of bullet
	var speed = 15;
    var count = 0;
    var width = this.width = height = this.height = 4;
    var pos = this.pos = new Vector2(x,y);
    //moving the bullet to the end of the ship (14 high)
    this.vel = new Vector2(0,0);
    if(direction === 'left'){
        this.pos = new Vector2(x,y+19);
        this.vel.x = -speed;
     }else{
        this.pos = new Vector2(x+28,y+19);
        this.vel.x = speed;
     }
	
	
	// instead set Vector with speed and rotate
	this.enabled = true;
	
	this.update = function() {
		count++;
        this.pos.plusEq(this.vel);
        
	};
	
	this.render = function(d) {
		d.lineWidth = 2;
		d.strokeStyle = "#fff";
		d.beginPath();
		d.arc(this.pos.x+Math.PI,this.pos.y+Math.PI,2, 0, Math.PI*2, true);
		d.stroke();
	};
    
    this.setMotion = function(x,y,direction){
        count = 0;
        if(direction === 'left'){
            this.pos = new Vector2(x,y+19);
            this.vel.x = -speed;
        }else{
            this.pos = new Vector2(x+28,y+19);
            this.vel.x = speed;
        }
    };
	
    this.getCount =function(){
        return count;
    };

    this.getEnabled = function(){
        return this.enabled;
    };
    
    this.setEnabled = function(enabled){
        this.enabled = enabled;
    };
    
    this.getLeft = function() {
		return this.pos.x;
	};
	
	this.getRight = function() {
		return this.pos.x+this.width;
	};

	this.getTop = function() {
		return this.pos.y;
	};
	
	this.getBottom = function () {
		return this.pos.y + this.height;
	};
    
    this.getHeight = function(){
        return this.height;
    };
};