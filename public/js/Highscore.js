function Highscore(){

	this.ajaxRequest;  // The variable that makes Ajax possible!
	
	try{
		// Opera 8.0+, Firefox, Safari
		this.ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			this.ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				this.ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}
}

Highscore.prototype.proxy = function(func){
		var self = this;
		return function(){
			return func.apply(self,arguments);
		};
	}


Highscore.prototype.sendScore = function(name,score){
	
	this.ajaxRequest.open("GET", "savescores.php?name="+name+"&score="+score, true);
	this.ajaxRequest.send(null);

	// Create a function that will receive data sent from the server
	this.ajaxRequest.onreadystatechange = function(){		
		if(this.readyState == 4){
			console.log('sent information');
		}
	};
}

Highscore.prototype.getScores = function(){
	
	var self = this;

	this.ajaxRequest.open("GET", "getscores.php", true);
	this.ajaxRequest.send(null);
		// Create a function that will receive data sent from the server
	this.ajaxRequest.onreadystatechange = function(){
		if(this.readyState == 4){
			self.setScores(this);
		}
	}
}

Highscore.prototype.setScores = function(e){
	var event;	
	if (document.createEvent) {
    	event = document.createEvent("HTMLEvents");
    	event.initEvent("setHighScores", true, true);
  	} else {
    	event = document.createEventObject();
    	event.eventType = "setHighScores";
	}

	event.scores =  e.response
	  // event.eventName = eventName;
	  // event.memo = memo || { };

	  if (document.createEvent) {
	    document.dispatchEvent(event);
	  } else {
	    document.fireEvent("on" + event.eventType, event,e.response);
	  }

}
