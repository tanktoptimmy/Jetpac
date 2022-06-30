window.addEventListener('load', eventWindowLoaded,false);
            // shim layer with setTimeout fallback
            window.requestAnimFrame = (function(){
                return  window.requestAnimationFrame   ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    window.oRequestAnimationFrame      ||
                    window.msRequestAnimationFrame     ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            
            function eventWindowLoaded(){
                canvasApp();
            }
            
            function canvasApp(){

                const HIGH_SCORES = 'high_scores';
                const GAME_END = 'game_end';
                const GAME_START = 'game_start';
                const GAME_PLAY = 'game_play';
                const GAME_LOADING = "game_loading";
                const GAME_NEXT_LEVEL = "game_next_level";
                let APP_STATE = null;
                const IN_PLAY_BUILDING_ROCKET = "building_rocket";
                const IN_PLAY_REFUELING = "refuelling";
                const IN_PLAY_REFUELLED = "refuelled";
                const IN_PLAY_SPACESHIP_TAKEOFF = "take_off";
                const IN_PLAY_SPACESHIP_LANDING = "landing";
                const SCORE_BOARD = "score_board";
                const SOUND_EXPLODE = "explode1";
                const SOUND_EXPLOSION = "explosion1";
                const SOUND_SHOOT = "shoot1";
                const SOUND_SONICBOOM = "sonicboom";
                const SOUND_FUELLED = "fuelled";
                const MAX_SOUNDS = 11;                

                var level,
                lives,
                score,
                scoreText,
                game_state = GAME_START,
                in_play = IN_PLAY_BUILDING_ROCKET,
                aliens,numberOfAliens = 0,
                alienInterval,alienCreateInterval = 1000,
                maxNumberOfAliens,
                alienObjects = [
                    {'y':0, 'height': 30, 'width': 33, 'bounce': false, 'bidirectional': true},
                    {'y':31, 'height': 20, 'width': 33, 'bounce': false, 'bidirectional': true},
                    {'y':52, 'height': 14, 'width': 33, 'bounce': true, 'bidirectional':true},
                    {'y':67, 'height': 28, 'width': 33, 'bounce': true, 'bidirectional': true}
                ],
                //SOUNDS
                soundPool = [],
                explodeSound,explodeSound2,explodeSound3,
                shootSound,shootSound2,shootSound3,
                audioType,
                
                loadCount,itemsToLoad,
                overlayAlpha = 0,

                player,
                playerImg,
                spaceship,spaceshipWithFuel,
                shipParts = [],shipPosition = 470,shipSegmentHeight = 32,
                spaceshipStartY = 478,

                fuel,fuelCount,fuelImg,

                explosion,explosionImg,explosions = [],spareExplosions = [],
                bonus,bonusImg,bonusTimer,
                bonusObjects =  [{'sx':0,'sy':0,'sWidth':28,'sHeight':24},
                                {'sx':0,'sy':23,'sWidth':32,'sHeight':18},
                                {'sx':0,'sy':42,'sWidth':35,'sHeight':25},
                                {'sx':0,'sy':67,'sWidth':35,'sHeight':31}],

                alienImg,
                // spaceshipImg.onload = function(){  
                //     init()
                // };  

                // screen size variables
                SCREEN_WIDTH = 640,//window.innerWidth,
                SCREEN_HEIGHT = 480,//window.innerHeight,

                //get the canvas object from the DOM
                canvas = document.createElement( 'canvas' ),
                //give the canvas its context
                ctx = canvas.getContext( '2d' ),
                //particles/stars
                particles = [],p,
                //bullets
                bullets = [],
                spareBullets = [],
                //edges
                edges = [],
                edgeLevels, edgedToDraw,
                edgeImg,
                //keys down
                leftDown,rightDown,upDown,
                aliens = [],
                spareAliens = [],

                // highScore = new Highscore(),
                // highScores = [],
                showingCongratsPrompt = false;;

                gameStateInit();


                function gameStateInit(){

                    // Setup canvas and expose context via ctx variable


                    loadCount = 0;
                    itemsToLoad = 4//17;

                    explodeSound = document.createElement('audio');
                    document.body.appendChild(explodeSound);
                    audioType = supportedAudioFormat(explodeSound);
                    explodeSound.setAttribute('src','sound/explode1.' + audioType);
                    explodeSound.addEventListener('canplaythrough',itemLoaded,false);

                    explodeSound2 = document.createElement('audio');
                    document.body.appendChild(explodeSound2);
                    audioType = supportedAudioFormat(explodeSound2);
                    explodeSound2.setAttribute('src','sound/explode1.' + audioType);
                    explodeSound2.addEventListener('canplaythrough',itemLoaded,false);

                    explodeSound3 = document.createElement('audio');
                    document.body.appendChild(explodeSound3);
                    audioType = supportedAudioFormat(explodeSound3);
                    explodeSound3.setAttribute('src','sound/explode1.' + audioType);
                    explodeSound3.addEventListener('canplaythrough',itemLoaded,false);
                    
                    
                    explosionSound = document.createElement('audio');
                    document.body.appendChild(explosionSound);
                    audioType = supportedAudioFormat(explosionSound);
                    explosionSound.setAttribute('src','sound/explosion.' + audioType);
                    explosionSound.addEventListener('canplaythrough',itemLoaded,false);

                    explosionSound2 = document.createElement('audio');
                    document.body.appendChild(explosionSound2);
                    audioType = supportedAudioFormat(explosionSound2);
                    explosionSound2.setAttribute('src','sound/explosion.' + audioType);
                    explosionSound2.addEventListener('canplaythrough',itemLoaded,false);

                    explosionSound3 = document.createElement('audio');
                    document.body.appendChild(explosionSound3);
                    audioType = supportedAudioFormat(explosionSound3);
                    explosionSound3.setAttribute('src','sound/explosion.' + audioType);
                    explosionSound3.addEventListener('canplaythrough',itemLoaded,false);
                                      

                    shootSound = document.createElement('audio');
                    document.body.appendChild(shootSound);
                    audioType = supportedAudioFormat(shootSound);
                    shootSound.setAttribute('src','sound/shoot1.' + audioType);
                    shootSound.addEventListener('canplaythrough',itemLoaded,false);

                    shootSound2 = document.createElement('audio');
                    document.body.appendChild(shootSound2);
                    audioType = supportedAudioFormat(shootSound2);
                    shootSound2.setAttribute('src','sound/shoot1.' + audioType);
                    shootSound2.addEventListener('canplaythrough',itemLoaded,false);

                    shootSound3 = document.createElement('audio');
                    document.body.appendChild(shootSound3);
                    audioType = supportedAudioFormat(shootSound3);
                    shootSound3.setAttribute('src','sound/shoot1.' + audioType);
                    shootSound3.addEventListener('canplaythrough',itemLoaded,false);

                    sonicboomSound = document.createElement('audio');
                    document.body.appendChild(sonicboomSound);
                    audioType = supportedAudioFormat(sonicboomSound);
                    sonicboomSound.setAttribute('src','sound/sonicboom.' + audioType);
                    sonicboomSound.addEventListener('canplaythrough',itemLoaded,false); 

             

                    fuelledSound = document.createElement('audio');
                    document.body.appendChild(fuelledSound);
                    audioType = supportedAudioFormat(fuelledSound);
                    fuelledSound.setAttribute('src','sound/fuelled.' + audioType);
                    //fuelledSound.setAttribute('src','sound/shoot1.' + audioType);
                    fuelledSound.addEventListener('canplaythrough',itemLoaded,false); 

             
                    playerImg = new Image();  
                    playerImg.src = '/public/images/player.png';                
                    playerImg.onload = itemLoaded;

                    bonusImg = new Image();  
                    bonusImg.src = '/public/images/bonuses.png';                
                    bonusImg.onload = itemLoaded;

                    spaceshipImg = new Image();
                    spaceshipImg.src = '/public/images/spaceship.png';
                    spaceshipImg.onload = itemLoaded;

                    fuelImg = new Image();
                    fuelImg.src = '/public/images/fuel.png';
                    fuelImg.onload = itemLoaded;

                    alienImg = new Image();
                    alienImg.src = '/public/images/alien.png';
                    alienImg.onload = itemLoaded;

                    explosionImg = new Image();
                    explosionImg.src = '/public/images/explosion.png';
                    explosionImg.onload = itemLoaded;

                    edgeImg = new Image();
                    edgeImg.src = '/public/images/platform.png';
                    edgeImg.onload = itemLoaded;

                }

                function itemLoaded(event){
                    loadCount++;
                    if(loadCount == itemsToLoad){
                        shootSound.removeEventListener('canplaythrough',itemLoaded,false);  
                        shootSound2.removeEventListener('canplaythrough',itemLoaded,false);   
                        shootSound3.removeEventListener('canplaythrough',itemLoaded,false);  
                        explodeSound.removeEventListener('canplaythrough',itemLoaded,false);  
                        explodeSound2.removeEventListener('canplaythrough',itemLoaded,false);   
                        explodeSound3.removeEventListener('canplaythrough',itemLoaded,false);

                        soundPool.push({name: 'explode1', element:explodeSound, played: false});
                        soundPool.push({name: 'explode1', element:explodeSound2, played: false});
                        soundPool.push({name: 'explode1', element:explodeSound3, played: false});
                        soundPool.push({name: 'explosion1', element:explosionSound, played: false});
                        soundPool.push({name: 'explosion1', element:explosionSound2, played: false});
                        soundPool.push({name: 'explosion1', element:explosionSound3, played: false});
                        soundPool.push({name: 'shoot1', element:shootSound, played: false});
                        soundPool.push({name: 'shoot1', element:shootSound2, played: false});
                        soundPool.push({name: 'shoot1', element:shootSound3, played: false});
                        soundPool.push({name: 'sonicboom', element:sonicboomSound, played: false});
                        soundPool.push({name: 'fuelled', element:fuelledSound, played: false});

                        init();

                    }

                }


                function init() {                    

                    // CANVAS SET UP

                    document.body.appendChild(canvas); 
                    canvas.width = SCREEN_WIDTH; 
                    canvas.height = SCREEN_HEIGHT;

                    ctx.fillStyle = "rgb(0,0,0)"; 
                    ctx.fillRect(0,0,SCREEN_WIDTH, SCREEN_HEIGHT); 
                    initListeners(); 
                    

                    for(var j = 0; j<100 ; j++ ){                        
                        p = new Particle(random(0,SCREEN_WIDTH),random(50,SCREEN_HEIGHT));                
                        particles.push(p);
                    }
                    
                    edges = [
                                [
                                new Edge({'img':null, 'x':0,'y':50, 'width':SCREEN_WIDTH,'height':1}),    
                                new Edge({'img':edgeImg, 'x':0,'y':SCREEN_HEIGHT-1,  'width':SCREEN_WIDTH,'height':1, 'colour': 'rgba(30,144,255,0.85)'}),
                                new Edge( {'img':edgeImg, 'x':150, 'y':250, 'width':120, 'height':20 ,'colour': 'rgba(30,144,255,0.85)'}),                               
                                new Edge( {'img':edgeImg, 'x':40, 'y':344, 'width':140, 'height':20  ,'colour': 'rgba(30,144,255,0.85)'}),
                                
                                new Edge( {'img':edgeImg, 'x':298, 'y':154, 'width':120, 'height':20  ,'colour': 'rgba(30,144,255,0.85)'}),
                                new Edge( {'img':edgeImg, 'x':560, 'y':200, 'width':80, 'height':20 ,'colour': 'rgba(30,144,255,0.85)'})
                            ],
                           
                             [
                                new Edge({'img':null, 'x':0,'y':50, 'width':SCREEN_WIDTH,'height':1}),    
                                new Edge({'img':null, 'x':0,'y':SCREEN_HEIGHT-1,  'width':SCREEN_WIDTH,'height':1, 'colour': 'rgba(30,144,255,0.85)'}),
                                                              
                                new Edge( {'img':edgeImg, 'x':140, 'y':344, 'width':140, 'height':20  ,'colour': 'rgba(30,144,255,0.85)'}),
                                
                                new Edge( {'img':edgeImg, 'x':298, 'y':154, 'width':100, 'height':20  ,'colour': 'rgba(30,144,255,0.85)'}),
                                new Edge( {'img':edgeImg, 'x':560, 'y':200, 'width':80, 'height':20 ,'colour': 'rgba(30,144,255,0.85)'})
                                
                            ]
                    ]
                    edgeLevels = edges.length;
                    //gameInterval = setInterval(gameLoop, 1000/60);
                    (function animloop(){
                        requestAnimFrame(animloop);
                        gameLoop();
                    })();

                }			

                function initListeners() {
                    document.addEventListener( 'keydown', onKeyDown, false );
                    document.addEventListener( 'keyup', onKeyUp, false );
                    // document.addEventListener('setHighScores', function(e){                        
                    //     var n = e.scores.split('|');
                    //     highScores = [];
                    //     for (var i = 0; i<n.length-1; i++){                            
                    //         highScores.push({"name":n[i],"score":zeroFix(n[i+1])})
                    //         i++
                    //     }                        
                    // }, false);
                    canvas.addEventListener('touchmove', function(event) {
                        for (var i = 0; i < event.touches.length; i++) {
                        var touch = event.touches[i];
                        ctx.beginPath();
                        ctx.arc(touch.pageX, touch.pageY, 20, 0, 2*Math.PI, true);
                        ctx.fill();
                        ctx.stroke();
                      }
                }, false);



                }

                function onKeyDown(e) {	

                    if(e.keyCode == 37) {
                        player.setDirection('left');
                        leftDown = true;

                    }else if (e.keyCode == 39){
                        player.setDirection('right'); 
                        rightDown = true;

                    }else if (e.keyCode == 38) {
                        upDown = true;
                    }else if(e.keyCode == 32) {
                        if(game_state == GAME_PLAY){
                            //only create new bullet if player is enabled
                            if(player.getEnabled()){
                                var bullet;
                                if(spareBullets.length>0){
                                    bullet = spareBullets.pop(); 
                                    bullet.enabled = true;                        
                                    bullet.setMotion(player.pos.x, player.pos.y, player.getDirection());
                                } else {
                                    bullet = new Bullet(player.pos.x, player.pos.y, player.getDirection());
                                    bullets.push(bullet);				
                                }
                                playSound(SOUND_SHOOT,0.5)
                            }
                        }else if(game_state == GAME_START||game_state == HIGH_SCORES){
                            resetGameElements();
                            in_play = IN_PLAY_BUILDING_ROCKET;                                 
                            setUpAliens();                                                
                            game_state = GAME_PLAY;                            
                        }else if(game_state = GAME_END){
                            game_state = GAME_START;
                        }

                    }else if(e.keyCode == 13){
                        if(game_state == GAME_START){
                            //go to high scores
                            // game_state = HIGH_SCORES;
                            // highScore.getScores();                            
                        }else if(game_state == HIGH_SCORES){
                            game_state = GAME_START;
                        }
                    }

                }
                function onKeyUp(e) {
                    if(e.keyCode == 38) upDown = false; 
                    else if(e.keyCode == 37) leftDown = false; 
                    else if (e.keyCode == 39) rightDown = false;

                }


                 function gameLoop(){
                    ctx.fillStyle='rgba(0,0,0,1)';
                    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)                                       
                    for(var i = 0; i<particles.length; i++){                    
                        particles[i].update();
                        if(particles[i].pos.x < 0){
                            particles[i].pos.x = SCREEN_WIDTH; 
                        }
                        particles[i].render(ctx); 	
                    }                                
                    if(game_state == GAME_PLAY){
                        ctx.textAlign = 'left';
                        inGameLoop()                    
                    }else if(game_state == GAME_START){
                        ctx.textAlign = 'center';
                        createTitleScreen()
                    }else if(game_state == GAME_END){
                        ctx.textAlign = 'center';
                        createEndScreen();
                    }else if(game_state == HIGH_SCORES){
                        ctx.textAlign = 'center';
                        createTitleScreen()
                        // createHighScores();
                    }

                }

                function checkCollisions(){
                    if(player.connectedEdge){
                        var edge = player.connectedEdge; 
                        if((player.getLeft()>edge.getRight()) || (player.getRight()<edge.getLeft()))
                            player.fall();

                    }
                    //edged collisions
                    var edleng = edges[edgesToDraw].length;
                    for (var i = 0; i < edleng; i++){
                        var edge = edges[edgesToDraw][i]; 

                        if((player.pos.y+player.height > edge.getTop()) && (player.pos.y+player.height - player.vel.y < edge.getTop())) {
                            if((player.getLeft() < edge.getRight()) && (player.getRight()> edge.getLeft())) {
                                player.connectedEdge = edge; 
                                player.pos.y = edge.pos.y - player.height; 
                                player.vel.y = 0; 	
                            }
                        }
                        
                        if(shipParts.length > 0){
                            if(shipParts[0].getReleased()){                            
                                if(checkHorizCollision( edge, shipParts[0] ) ){
                                    if(checkVertCollision( edge, shipParts[0] ) ){
                                        shipParts[0].setReleased(false);
                                        shipParts[0].setDraggable(true);
                                        shipParts[0].setY(edge.getTop() - shipParts[0].getHeight())
                                    }                                
                                }
                            }
                        }                           
                        
                        if(fuel.getReleased()){                            
                            if(checkHorizCollision( edge, fuel ) ){
                                if(checkVertCollision( edge, fuel ) ){
                                    fuel.setReleased(false);
                                    fuel.setDraggable(true);
                                    fuel.setY(edge.getTop() - fuel.getHeight())
                                }                                
                            }
                        }
                    
                        if(bonus.getFalling()){                            
                            if(checkHorizCollision( edge, bonus ) ){                                
                                if(checkVertCollision( edge, bonus ) ){                                                                 
                                    bonus.setFalling(false)                                    
                                    bonus.setY(edge.getTop() - bonus.getHeight())
                                }                                
                            }   
                        }

                    }

                    ////checking for collisions with aliens
                    var alienLength = aliens.length
                    for (var j = 0; j<alienLength; j++){
                        var alien = aliens[j]

                        //if the player is currently alive check to see if its collided with an alien
                        if(player.getEnabled() && !player.getIndestructible()){
                            if( checkHorizCollision( player , alien ) ){                            
                                if( checkVertCollision( player, alien ) ){
                                    if( alien.enabled ){ 

                                        createExplosion(player.pos.x,player.pos.y)                                                                               
                                        killPlayer() ;
                                        continue;
                                    }								
                                    
                                }
                            }
                        }
                        //checking for collision between edges and aliens 
                        var edleng = edges[edgesToDraw].length;
                        for (var k = 0; k < edleng; k++){
                            var edge = edges[edgesToDraw][k];                       
                            if( alien.enabled ){                            
                                if( checkVertCollision( edge , alien ) ){                               
                                    if( checkHorizCollision( edge , alien ) ){
                                        if( alien.getBounce() ){                                            
                                            var xVelInvert = false;
                                            //form right to left
                                            var diff = alien.pos.x - (edge.pos.x + edge.getWidth())                                          
                                            if( diff < - (15* alien.vel.x) && diff > (15* alien.vel.x) ){
                                                xVelInvert = true;

                                            }
                                            //from left to right
                                            if(!xVelInvert){
                                                var diff2 = alien.pos.x + alien.getWidth() - edge.pos.x + alien.vel.x;
                                                if( diff2 > - (15* alien.vel.x) && (diff2 < 15* alien.vel.x)  /*|| alien.pos.x == edge.pos.x + edge.getWidth() - alien.vel.x */){
                                                    xVelInvert = true;                                            
                                                }
                                            }
                                            alien.changeDirection( true, xVelInvert );
                                        }else{ 
                                            createExplosion(alien.getLeft(),alien.getTop())                                       
                                            removeAlien(alien)                                        
                                        }
                                    }
                                }
                            }
                        }
                        //checking for collision between bullets and aliens
                        var bulls = bullets.length;                    
                        for (var m = 0; m < bulls ;m++){
                            var bullet = bullets[m];
                            if( bullet.getEnabled() ){                                                     
                                if( checkHorizCollision(  alien, bullet ) ){                                                                 
                                    if( checkVertCollision(  alien, bullet ) ){
                                            createExplosion(alien.getLeft(),alien.getTop())
                                            removeAlien(alien);
                                            removeBullet(bullet);
                                            playSound(SOUND_EXPLODE,0.5)                                        
                                            score += 50;
                                            setScoreText();
                                    }
                                }
                            }
                        }

                    }    
                }

                function removeAlien(alien){               
                    spareAliens.push(alien);
                    alien.setEnabled(false); 
                    alien.pos.x = -200;
                    alien.pos.y = -200;
                    numberOfAliens--;
                }

                function removeBullet(bullet){
                    bullet.enabled = false; 
                    spareBullets.push (bullet); 
                }

                function killPlayer(){
                    if(lives > 0){

                        lives--;                                
                        
                        //set player enabled to false;
                        player.setEnabled(false)
                        //create explosion()
                        //move player to new position;
                        
                        resetPlayerPlacement()
                        player.setIndestructible()
                        player.setEnabled(true)

                        if(in_play == IN_PLAY_REFUELING && fuel.getPickedUp()){                         
                            fuel.setReleased(true);                        
                            fuel.setPickedUp(false);
                            fuel.setDraggable(true)
                        }else if(in_play == IN_PLAY_BUILDING_ROCKET && shipParts[0].getPickedUp()){
                            shipParts[0].setReleased(true);                        
                            shipParts[0].setPickedUp(false);
                            shipParts[0].setDraggable(true)
                        }
                    }else{                        
                        game_state = GAME_END;
                        //need to release the keys
                        upDown = false; 
                        leftDown = false; 
                        rightDown = false;

                    }

                    playSound(SOUND_EXPLOSION,0.5);
                    
                }

                function checkVertCollision( obj1 , obj2 ){                  
                    if( (obj1.getTop() + obj1.getHeight() ) >= obj2.getTop() && obj1.getTop() <= ( obj2.getTop() + obj2.getHeight() ) ) return true;    return false ;                
                }

                function checkHorizCollision( obj1 , obj2 ){                   
                    if((obj1.getLeft() < obj2.getRight()) && (obj1.getRight()> obj2.getLeft())) return true ;
                    return false ;			
                }


                
                
                function checkAboveShip(what){                    
                    if(what.getPickedUp()){                            
                        what.setX(player.pos.x);
                        what.setY(player.pos.y + player.getHeight() - what.getHeight());                                
                        if( player.getLeft() > shipPosition - 2 && player.getLeft() < shipPosition + 2 ){
                            what.setX(shipPosition)
                            what.setPickedUp(false);
                            what.setReleased(true);
                            what.setConnected(true);
                            }
                        }
                    }
                function checkHitPickup(what){
                    if( checkHorizCollision( player , what ) ){                                
                            if( checkVertCollision( player, what ) ){                                           
                                if( what.getDraggable() ){
                                    what.setDraggable(false);                                    
                                    what.setPickedUp(true);                                                                            
                                }                                                                                                       
                            }
                        }
                        
                    }

                function checkBonusPickup(){
                    if(player.getEnabled() && bonus.getEnabled()){
                        if( checkHorizCollision( player , bonus ) ){                                
                                if( checkVertCollision( player, bonus ) ){                                           
                                    bonus.setEnabled(false)
                                    playSound(SOUND_FUELLED,0.5)
                                    score += 200;                                                                                                      
                                }
                            }
                    }
                }

                function resetGameElements(){
                    clearInterval(alienInterval);
                    showingCongratsPrompt = false;                    
                    numberOfAliens = 0;
                    aliens = [];
                    spareAliens = [];
                    edged = [];
                    explosions = [];
                    spareExplosions = [];                 
                    //reset number of lives
                    lives = 3;
                    score = 0;
                    level = 0;
                    fuelCount = 0;
                    maxNumberOfAliens = 6;
                    setUpGameElements();                    
                }



                function setUpGameElements(){                                    
                        player = null;
                        spaceship = null;
                        shipParts = [];
                        spaceshipWithFuel = null;
                        fuel = null;
                        clearInterval(bonusTimer)
                        bonusTimer = setInterval(referencingCallBack(this,startBonus),5000);
                        //create all init ojects on the page
                        player = new Player(playerImg,400,50);
                        bonus = new Bonus({'img': bonusImg});

                        

                        //BASE
                        spaceship = new Spaceship({'img':spaceshipImg,'sx':0,'sy':64,'sWidth':32,'sHeight':32,'dx':shipPosition,'dy':446,'dWidth':32,'dHeight':32,'draggable':false})
                        shipParts.push(new Spaceship({'img':spaceshipImg,'sx':0,'sy':32,'sWidth':32,'sHeight':32,'dx':60,'dy':312,'dWidth':32,'dHeight':32,'draggable':true}))
                        //TOP
                        shipParts.push(new Spaceship({'img':spaceshipImg,'sx':0,'sy':0,'sWidth':32,'sHeight':32,'dx':320,'dy':122,'dWidth':32,'dHeight':32,'draggable':false}))
                        
                       spaceshipWithFuel = new Spaceship({'img':spaceshipImg,'sx':32,'sy':96,'sWidth':32,'sHeight':0,'dx':shipPosition,'dy':spaceshipStartY,'dWidth':32,'dHeight':0,'draggable':false})                    

                        fuel = new Fuel({'img':fuelImg,'sx':0,'sy':0,'sWidth':32,'sHeight':20,'dx':random(0,400),'dy':122,'dWidth':32,'dHeight':20,'draggable':true}) 
                         
                                                                                  
                }

                function startBonus(){
                    if(!bonus.enabled && in_play === IN_PLAY_REFUELING){
                        bonus.setupBonus(bonusObjects[random(0,bonusObjects.length-1)]);
                        //bonus.setupBonus(bonusObjects[random(0,bonusObjects.length-1)]);
                    }
                }

                function setUpGameLevel(){
                    fuelCount = 0;               
                    level++;
                    aliens = [];
                    spareAliens = [];
                    numberOfAliens = 0;                    
                    maxNumberOfAliens = maxNumberOfAliens + level;
                    bonus.setEnabled(false);
                }

                function createTitleScreen(){
                    var x = canvas.width/2;
                    ctx.font = '40px Orbitron';
                    ctx.fillStyle = '#ffffff';                
                    ctx.fillText('Welcome to Jetpac{ish}',x,220);
                    ctx.strokeStyle   = "blue";
                    ctx.strokeText('Welcome to Jetpac{ish}', x,220);
                    ctx.font = '20px Orbitron';
                    ctx.fillText('Hit space to play', x,350)
                    // ctx.fillText('or Return to view high scores', x,380)

                    ctx.font = '15px Orbitron';
                    ctx.fillText('Use the arrow keys to go left and right and thrust',x,260);
                    ctx.fillText('Space bar fires bullets',x,290);
                }


                // function createHighScores(){
                //     var x = canvas.width/2;
                //     ctx.font = '40px Orbitron';
                //     ctx.fillStyle = '#ffffff';
                //     ctx.fillText('High Scores',x,150);
                //     ctx.strokeStyle   = "blue";
                //     ctx.strokeText('High Scores', x,150);
                //     ctx.font = '20px Orbitron';
                //     ctx.textAlign = 'left';
                //     if( highScores.length != 0 ) {
                //         for(var i = 0; i < highScores.length; i++){
                //             ctx.fillText(highScores[i].name ,170,185 + (i*25))
                //             ctx.fillText(highScores[i].score ,350,185 + (i*25))
                //         }
                //     }

                //     ctx.textAlign = 'center';
                //     ctx.fillText('Hit space to play', x,430)
                //     ctx.fillText('or Return to go to the home page', x,460)
                // }

                function zeroFix(score){
                    if(score.length < 10){
                        var zeros = 10 - score.length,
                        n="";
                        for (var i = 0; i<zeros; i++){
                            n+="0"
                        }
                    }
                    return n+score;
                }

                function createEndScreen(){

                    var x = canvas.width/2;
                    if (score == 0){
                        // highScore.getScores();
                        game_state = HIGH_SCORES;
                    }else{
                        if(showingCongratsPrompt == false){
                            var fName = prompt("Congratulations you scored " + score +". Enter your name : ", "");
                            showingCongratsPrompt = true;

                            if(fName!=null){
                                // highScore.sendScore(fName,score);
                                // setTimeout(function(){
                                //     highScore.getScores();
                                //     game_state = HIGH_SCORES;
                                // },1000)
                            }else{
                                // highScore.getScores();
                                game_state = HIGH_SCORES;
                            }
                               
                        }
                    }
                    
                }

                function inGameLoop(){
                      //spaceship
                        spaceship.render(ctx);
                        if( fuelCount > 0 ){
                            spaceshipWithFuel.render(ctx);
                        }
                        if(in_play == IN_PLAY_BUILDING_ROCKET){
                            for(var i = 0, len = shipParts.length; i<len; i++){
                                shipParts[i].render(ctx)
                            }                            
                        }

                        if(in_play == IN_PLAY_REFUELING){
                            fuel.render(ctx);
                        }
                        //edges
                        edgesToDraw = level%edgeLevels;
                        
                        for(var i = 0; i<edges[edgesToDraw].length; i++){                   
                            var edge = edges[edgesToDraw][i]; 
                            edge.render(ctx);                   
                        }   
                        
                        //PLAYER
                        if(upDown){
                            player.thrust();
                        }
                        player.update();

                        bonus.update();
                        bonus.render(ctx);
                                                
                        if(player.pos.x < 0) player.pos.x = SCREEN_WIDTH-player.width; 
                        else if(player.getRight()>SCREEN_WIDTH) player.pos.x = 0+(player.width/2); 

                        if(player.pos.y < 50) player.pos.y = 50; 
                        else if(player.getBottom()>SCREEN_HEIGHT) player.pos.y = SCREEN_HEIGHT - player.getHeight(); 

                        if(leftDown) player.moveLeft(); 
                        else if(rightDown) player.moveRight(); 

                        //BULLETS
                        for (var i=0; i<bullets.length;i++) {
                            bullet = bullets[i];

                            if(!bullet.enabled) continue;
                            bullet.update();

                            if(bullet.pos.x < 0 || bullet.pos.x >SCREEN_WIDTH || bullet.getCount() == 25) 
                            {
                                removeBullet(bullet)                            
                            }

                            bullet.render(ctx);     
                        }

                        //move alien to other side of screen
                        for(var j = 0; j < aliens.length; j++){

                            var alien = aliens[j];
                            alien.update();
                            if(alien.pos.x > SCREEN_WIDTH){                                
                                alien.pos.x = 0;
                            }else if(alien.getDirection() == 'neg' && alien.pos.x < -alien.getWidth()){
                                alien.pos.x = SCREEN_WIDTH;
                            }
                            alien.render(ctx);
                        }

                        //render explosions
                        for(var j = 0; j < explosions.length; j++){
                            var explosion = explosions[j];
                            if(explosion.getEnabled()){
                                explosion.update()
                                explosion.render(ctx);
                            }else{
                                spareExplosions.push(explosion)
                            }
                        }


                        if(in_play == IN_PLAY_BUILDING_ROCKET){

                            checkAboveShip(shipParts[0])
                            checkHitPickup(shipParts[0])
                            
                            if(shipParts[0].getReleased()){
                                var newPosY = shipParts[0].getTop()+2
                                shipParts[0].setY(newPosY);
                                if(newPosY > spaceship.getTop() - shipParts[0].getHeight() && shipParts[0].getConnected()){
                                    shipParts[0].setReleased(false);
                                    spaceship.changeHeight(32);
                                    shipParts[0].setEnabled(false);
                                    shipParts.splice(0,1);
                                    score += 200;

                                    if(shipParts.length>0){
                                        shipParts[0].setDraggable(true);
                                    }else{
                                        in_play = IN_PLAY_REFUELING;
                                    }
                                }
                            }                        
                        }


                        //@TODO need to make sure that the fuel is hitting the ship (X) as well as the Y
                        if(in_play == IN_PLAY_REFUELING){
                            checkAboveShip(fuel)
                            checkHitPickup(fuel)
                             if(fuel.getReleased()){
                                    var newPosY = fuel.getTop()+2
                                    fuel.setY(newPosY);
                                    if(newPosY > spaceship.getTop() - fuel.getHeight() && fuel.getConnected()){
                                        fuel.setReleased(false);               
                                        fuel.setEnabled(false);
                                        fuelCount++;
                                        spaceshipWithFuel.changeHeight(24);
                                        score += 100;
                                        playSound(SOUND_FUELLED,0.5)
                                        if(fuelCount == 4){
                                            spaceship.setEnabled(false)
                                            fuel.setX( -300 )                                            
                                            in_play = IN_PLAY_REFUELLED;
                                        }else{
                                            fuel.setX(random(0,400));
                                            fuel.setReleased(true);
                                            fuel.setConnected(false)
                                            fuel.setPickedUp(false);
                                            fuel.setDraggable(true)
                                            fuel.setY(60)
                                        }                                    
                                    }
                                }

                                if(bonus.getFalling()){
                                    var newPosY = bonus.getTop()+2;
                                    bonus.setY(newPosY);
                                }
                                checkBonusPickup();
                        }

                        if(in_play == IN_PLAY_REFUELLED){
                          if(player.getEnabled()){
                                if( checkHorizCollision( player , spaceshipWithFuel ) ){
                                    if( checkVertCollision( player, spaceshipWithFuel ) ){
                                        player.setEnabled(false);
                                        in_play = IN_PLAY_SPACESHIP_TAKEOFF;
                                        playSound(SOUND_SONICBOOM,0.5)                              
                                    }
                                }
                            }
                            if(bonus.getFalling()){
                                var newPosY = bonus.getTop()+2;                
                                bonus.setY(newPosY);
                            }
                            checkBonusPickup();
                        }

                        if(in_play == IN_PLAY_SPACESHIP_TAKEOFF){
                            spaceshipWithFuel.setY(spaceshipWithFuel.getTop() - 2);
                            if(spaceshipWithFuel.getY()<300){
                                drawOverlay('UP');            
                            }
                            if(bonus.getFalling()){
                                var newPosY = bonus.getTop()+2;                
                                bonus.setY(newPosY);
                            }
                        }
                        if(in_play == IN_PLAY_SPACESHIP_LANDING){
                            spaceship.setY(spaceship.getTop() + 2);
                            if(spaceship.getY()<300){
                                drawOverlay('DOWN');
                            }
                            if(spaceship.getY()+spaceship.getHeight() >= spaceshipStartY){
                                spaceship.setY(spaceshipStartY - spaceship.getHeight())                                
                                spaceshipWithFuel.changeHeight(-96);
                                spaceshipWithFuel.setY(spaceshipStartY)
                                player.setEnabled(true);
                                resetPlayerPlacement();
                                fuel.setX(random(0,400));
                                fuel.setReleased(true);
                                fuel.setConnected(false)
                                fuel.setPickedUp(false);
                                fuel.setDraggable(true)
                                fuel.setY(60)
                                in_play = IN_PLAY_REFUELING;
                                spaceshipWithFuel.setEnabled(true)
                            }
                        }


                        checkCollisions()
                        displayLives();
                        setScoreText();


                        player.render(ctx);
                        
                        //show score - @TODO create a score class
                        showScore();
                }

                function displayLives(){            
                    for(var i =0 ; i<lives; i++){
                        ctx.drawImage(playerImg,29,0,28,38,570+(i*20),20,14,19); 
                    }
                }

                function setUpAliens(){
                    alienInterval = setInterval(createAlien,300)
                }

                function createAlien(){                
                    if(numberOfAliens < maxNumberOfAliens){                      
                       if(spareAliens.length > 0){
                        
                            alien = spareAliens.pop(); 
                            alien.setEnabled(true);
                            alien.setMotion(random(70,SCREEN_HEIGHT - 50));

                       } else {                           
                           aliens.push(alien = new Alien(alienImg,0,random(70,SCREEN_HEIGHT - 50),alienObjects[level%4],level,SCREEN_WIDTH));
                       }

                       numberOfAliens++;
                    }
                }

                function createExplosion(x,y){
                    
                    if(spareExplosions.length > 0){                        
                        explosion = spareExplosions.pop();
                        explosion.enabled = true;
                        explosion.setRandomSize();
                        explosion.setY(y);
                        explosion.setX(x);
                    } else {
                        explosions.push(explosion = new Explosion(explosionImg,x,y));  
                    }                                
                }

                function resetPlayerPlacement(){
                    player.pos.x = 350;
                    player.pos.y = SCREEN_HEIGHT - player.getHeight();
                    player.resetVelocity();
                }

                //@TODOneed to put this into a class 
                function showScore(){
                    ctx.font = '20px Orbitron';
                    ctx.fillStyle = '#ffffff';                
                    ctx.fillText('Score: ' + scoreText,10,40);
                }

                function setScoreText(){
                    scoreText = zeroPad(score,8);
                }

                function drawOverlay(dir){
                    if(dir == 'UP'){
                        overlayAlpha += 0.01;
                        if(overlayAlpha > 1.2){
                            spaceship.setEnabled(true);
                            spaceship.setY(100);
                            spaceshipWithFuel.setEnabled(false);
                            in_play = IN_PLAY_SPACESHIP_LANDING;
                            setUpGameLevel();
                        }
                    }else{
                        overlayAlpha -= 0.01;
                    }
                    ctx.fillStyle = "rgba(0,0,0," + overlayAlpha + ")"
                    ctx.fillRect(0,50,SCREEN_WIDTH, SCREEN_HEIGHT); 
                    
                }

                //working out which type of audio file to use
                function supportedAudioFormat(audio){
                    var returnExtention = "";
                    if ( audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe" ){
                        returnExtension = "ogg";
                    }else if ( audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp4") == "maybe" ){
                        returnExtension = "mp3";
                        console.log('mp3')
                    }
                    else if ( audio.canPlayType("audio/mp4") == "probably" || audio.canPlayType("audio/mp4") == "maybe" ){
                        console.log('mp4')
                        returnExtension = "mp4";
                    }else if ( audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe" ){
                        console.log('wav')
                        returnExtension = "wav";
                    }

                    return returnExtension;
                }

                function playSound(sound,volume) {                    
                    var soundFound = false,
                    soundIndex = 0,
                    tempSound;

                    if(soundPool.length > 0) {
                        while(!soundFound && soundIndex < soundPool.length) {
                            var tSound = soundPool[soundIndex];
                            if((tSound.element.ended || !tSound.played) && tSound.name == sound){
                                soundFound = true;
                                tSound.played = true;
                            }else{
                                soundIndex++;
                            }
                        }

                    }
                
                    if(soundFound){                      
                        tempSound = soundPool[soundIndex].element;    
                        tempSound.volume = 0.5;
                        tempSound.play();
                    }else if(soundPool.length < MAX_SOUNDS){                        
                        tempSound = document.createElement('audio');
                        tempSound.setAttribute('src', sound + '.' + audioType);
                        tempSound.volume = volume;
                        tempSound.play();
                        soundPool.push({name:sound, element:tempSound,type:audioType,played:true});
                    }
                }

                /************************\
                         HELPERS                    
                \************************/

                //putting 0's on the front of the score
                function zeroPad(num,count){
                    var numZeropad = num + '';
                    while(numZeropad.length < count) {
                        numZeropad = "0" + numZeropad;
                    }
                    return numZeropad;
                }

                //@TODO make this an object
                //get random numbers between min & max
                function random(min, max){
                    return Math.round(((Math.random()*(max-min))  +min));
                }

                function referencingCallBack(instance,method){
                    return function(){
                        return method.apply(instance,arguments)
                }

                }
            }
