function Player(img, x, y) {

	var pos = this.pos = new Vector2(x,y);
	var vel = this.vel = new Vector2(0,0);
	var drag = this.drag = new Vector2(0.6, 0.95);
    var direction = 'right';
    var self = this;
	var counter = 0;
	this.gravity = 0.04;
	this.imgY = 0;
	
	this.width = 24;
	this.height = 38;
    this.enabled = true;
    this.indestructible = false;
    that = this;
    

	this.connectedEdge = null;
	
	this.update = function (){
		counter ^= 1;
		if(!this.connectedEdge){
            if(vel.y<5){
                vel.y+=this.gravity;
            }
		}else{
            vel.x = vel.x*drag.x;
        }
			
		pos.plusEq(vel);
	}; 
	
	this.render = function(c){
	if(this.enabled){
		if(this.connectedEdge){
			if(self.direction == 'left' && vel.x<-0.1){
				counter == 1? c.drawImage(img,58,this.imgY,28,38,pos.x,pos.y,28,38):c.drawImage(img,87,this.imgY,28,38,pos.x,pos.y,28,38);
	            	}else if(self.direction == 'right' && vel.x>0.1){
	                    counter == 1? c.drawImage(img,116,this.imgY,28,38,pos.x,pos.y,28,38):c.drawImage(img,145,this.imgY,28,38,pos.x,pos.y,28,38); 
	                }else if(self.direction == 'left'){                
	                    c.drawImage(img,0,this.imgY,28,38,pos.x,pos.y,28,38);  
	                }else{              
	                    c.drawImage(img,29,this.imgY,28,38,pos.x,pos.y,28,38);  
	                }
	            }else if(self.direction == 'left'){
	                 c.drawImage(img,0,this.imgY,28,38,pos.x,pos.y,28,38);
	            }else{            
	                c.drawImage(img,29,this.imgY,28,38,pos.x,pos.y,28,38);
	            }
	        }
	};
	
	this.moveLeft = function() {
        if(this.vel.x>-3){
            this.vel.x+=-1;
        }
	};
	
	this.moveRight = function() {
		if(this.vel.x<3){
            this.vel.x+=1;
        }
		
	};

	this.resetVelocity = function(){
		this.vel.x = 0;
		this.vel.y = 0;
	};
	
	this.thrust = function() {
       if(vel.y>-1){
            vel.y -= 1;
       }
       pos.plusEq(vel);
       this.connectedEdge = null;
	};
	
	this.fall = function(){
		this.connectedEdge = null;
	};
	

	
	this.getLeft = function() {
		return pos.x;
	};
	
	this.getRight = function() {
		return pos.x+this.width;
		
	};

	this.getTop = function() {
		return pos.y;
	};
	
	this.getBottom = function () {
		return pos.y + this.height;
		
	};

    this.getHeight = function() {
		return this.height;
		
	};


    this.setDirection = function(dir){
        this.direction = dir;
    };
    
    this.getDirection = function(){
        return this.direction;
    };

    this.setEnabled = function(enabled){
        this.enabled = enabled;
    };
    
    this.getEnabled = function(){
        return this.enabled;
    };

    this.setIndestructible = function(){
    	this.indestructible = true;
    	this.imgY = 40;
    	setTimeout(this.referencingCallBack(this,this.removeIndestructible),4000);
    };

    this.getIndestructible = function(){
    	return this.indestructible;
    };

    this.removeIndestructible = function(){
    	this.indestructible = false;
    	this.imgY = 0;    	
    };

}

Player.prototype.referencingCallBack = function(instance,method){
	return function(){
		return method.apply(instance,arguments);
	};
}