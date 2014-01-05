Explosion = function(img, x, y) {
	//@TODO reuse setup of bullet
	//console.log('img: ',img)
    this.count = 0;
    this.width = this.height = 100;
    this.x = x;
    this.y = y;

    this.img = img;
    this.size = random(50,100);
	this.enabled = true;
	
	this.update = function() {
       if(this.count < 74){
            this.count++;
        }else{
            this.count = 0;
            this.enabled = false;
        }
	};
	
	this.render = function(c) {
        if(this.count < 63){
            var xNum = (this.count%7) * this.width,
            yNum = Math.floor(this.count/7) * this.height;
               
            c.drawImage(this.img,xNum,yNum,100,100,this.x,this.y,this.size,this.size);
       }else{
            this.enabled = false;
            this.count = 0;
       }
	};
    
    
    this.getEnabled = function(){
        return this.enabled;
    };
    
    this.setEnabled = function(enabled){
        this.enabled = enabled;
    };

    this.setY = function(y){
        this.y = y;
    };
    
    this.setX = function(x){
        this.x = x;
    };
    
    this.setRandomSize = function(){
        this.size = random(50,100);
    };

    function random(min, max){
        return Math.round(((Math.random()*(max-min))  +min));
    }
};