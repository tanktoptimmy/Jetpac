Particle = function(x, y) {
	//@TODO reuse setup of bullet
	var speed = 0.5;
    var count = 0;
    
    //moving the bullet to the end of the ship (14 high)
    this.vel = new Vector2(0,0);
    this.pos = new Vector2(x,y);
    this.vel.x = -speed;
	this.update = function() {
        this.pos.plusEq(this.vel);
        
	};
	
	this.render = function(c) {
        c.fillStyle = "rgba(150,255,0,0.5)";
		c.beginPath();
		c.arc(this.pos.x,this.pos.y,2, 0, Math.PI*2, true);
        c.fill();
	};
};