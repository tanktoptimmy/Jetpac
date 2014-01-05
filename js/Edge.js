function Edge(ob)
{
	this.pos = new Vector2(ob.x, ob.y);
	this.img = ob.img;
    this.colour = (typeof ob.colour == 'undefined') ? 'rgba(30,14,254,0.85)' : ob.colour;
	this.width = ob.width;
    this.segments = (this.width-20)/20;
    this.segmentsPos = [];
    for(var i = 0; i<this.segments;i++){
        this.segmentsPos.push(( this.pos.x+10 ) + ( i * 20 ));
    }
    this.height = ob.height;
    
	this.getLeft = function(){
		return this.pos.x;
	};

	this.getRight = function(){
		return this.pos.x+this.width;
	};

	this.getTop = function(){
		return this.pos.y;
	};

    this.getBottom = function(){
        return this.pos.y+this.height;
    };

    this.getHeight = function(){
        return this.height;
    };

    this.getWidth = function(){
        return this.width;
    };
}

Edge.prototype.render = function(ctx){
        if(this.img){
            //'sx':0,'sy':64,'sWidth':32,'sHeight':32,'dx':shipPosition,'dy':446,'dWidth':32,'dHeight':32
           ctx.drawImage(this.img,0,0,10,15,this.pos.x,this.pos.y,10,15);
           ctx.drawImage(this.img,32,0,10,15,this.pos.x + this.width - 10 ,this.pos.y,10,15);
           for (var i = 0 ; i < this.segments; i++){
               ctx.drawImage(this.img,11,0,20,15,this.segmentsPos[i] ,this.pos.y,20,15);
           }
        }else{
            ctx.save();
            this.radius = 5;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.pos.x + this.radius, this.pos.y);
            ctx.lineTo(this.pos.x + this.width - this.radius, this.pos.y);
            ctx.quadraticCurveTo(this.pos.x + this.width, this.pos.y, this.pos.x + this.width, this.pos.y + this.radius);
            ctx.lineTo(this.pos.x + this.width, this.pos.y + this.height - this.radius);
            ctx.quadraticCurveTo(this.pos.x + this.width, this.pos.y + this.height, this.pos.x + this.width - this.radius, this.pos.y + this.height);
            ctx.lineTo(this.pos.x + this.radius, this.pos.y + this.height);
            ctx.quadraticCurveTo(this.pos.x, this.pos.y + this.height, this.pos.x, this.pos.y + this.height - this.radius);
            ctx.lineTo(this.pos.x, this.pos.y + this.radius);
            ctx.quadraticCurveTo(this.pos.x, this.pos.y, this.pos.x + this.radius, this.pos.y);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
}