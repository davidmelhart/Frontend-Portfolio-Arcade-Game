/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        // this loop variable will be used to stop and restart the main functions and rendering.
        loop = "running";

    canvas.width = 707;
    canvas.height = 685;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        
        if (loop === "running") {
            update(dt);
            render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        renderMenu();
        lastTime = Date.now();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        if (checkCollisions(allEnemies, player.x, player.y, 40) === true) {
            console.log("Oh no! You collided with a giant bug!");
            renderFailure();
        }

        if (checkCollisions(key, player.x, player.y, 0) === true) {
            console.log("You found a key.");
            key=[];
            player.hasKey= true;
            indicator.status = "on";    
        }

        if (checkCollisions(gate, player.x, player.y - 49, 0) === true && player.hasKey === true) {
            player.hasKey = false
            indicator.status = "off";
            for (obstacle in allObstacles) {
                if (allObstacles[obstacle].id === "gate") {
                    allObstacles.splice(obstacle, 1);
                }
            }
            gate[0].position="open";
            console.log("The gate is now open.")
        }

        if (checkCollisions(damsel, player.x, player.y, 0) === true) {
            console.log("You found a wild damsel in distress!");
            renderSuccess();
            
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        // player.update();
    }

    // Start Screen
    function renderMenu() {
        ctx.fillStyle = "#191919";
        ctx.fillRect(0,0,707,669);
        
        ctx.font = "30px Arial";
        ctx.fillStyle = "#cccccc";
        ctx.textAlign = "center";
        ctx.fillText("☺ Welcome! ☺", canvas.width/2, canvas.height/3);
        
        ctx.font = "24px Arial";
        ctx.fillText("You'll be able to play the game using", canvas.width/2, canvas.height/3+40);
        ctx.fillText("your arrow (↑←↓→) or WASD keys.", canvas.width/2, canvas.height/3+65);
        ctx.fillText("Your goal is to get the key", canvas.width/2, canvas.height/3+115);
        ctx.fillText("and rescue the damsel in distress.", canvas.width/2, canvas.height/3+140);
        ctx.fillText("Have fun and watch out for the bugs!", canvas.width/2, canvas.height/3+190);
        
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Press ENTER to Start", canvas.width/2, canvas.height*(2/3)+25);

        // An event listener is set to record when the player presses enter.
        // After this the listener is removed to prevent the player from firing several startups at once.
        document.addEventListener('keyup', function enter(e) {
            if (e.keyCode === 13) {
                document.removeEventListener('keyup', enter);
                startUp();
                main();
            }
        });
    }

    // End Game Screen
    function renderSuccess() {
        loop = "stopped";
        console.log("Success!");
        console.log("The game loop has stopped!");
        // The to make sure that the end-game screen is rendered after the main render function has stopped,
        // a millisecond timeout has been set. Otherwise the render function in the last loop
        // might run after the end-game screen has been drawn.
        setTimeout(function(){
            ctx.fillStyle = "#191919";
            ctx.fillRect(0,0,707,669);

            ctx.font = "42px Arial";
            ctx.fillStyle = "#cccccc";
            ctx.textAlign = "center";
            ctx.fillText("Success!", canvas.width/2, canvas.height/2-50);
            ctx.font = "24px Arial";
            ctx.fillText("♡ You have freed your damsel in distress! ♡", canvas.width/2, canvas.height/2);
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Press ENTER to Try Again", canvas.width/2, canvas.height/2+50);
            
            document.addEventListener('keyup', function enter(e) {
                if (e.keyCode === 13) {
                    document.removeEventListener('keyup', enter);
                    loop = "running";
                    reset();
                }
            });
        }, 1)

    }

    // Game Over Screen
    function renderFailure() {
        loop = "stopped";
        console.log("Failure!");
        console.log("The game loop has stopped!");

        setTimeout(function(){
            ctx.fillStyle = "#191919";
            ctx.fillRect(0,0,707,669);

            ctx.font = "42px Arial";
            ctx.fillStyle = "#cccccc";
            ctx.textAlign = "center";
            ctx.fillText("Game Over!", canvas.width/2, canvas.height/2-50);
            ctx.font = "24px Arial";
            ctx.fillText("☹ Be more careful next time! ☹", canvas.width/2, canvas.height/2);
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Press ENTER to Try Again", canvas.width/2, canvas.height/2+50);
            
            document.addEventListener('keyup', function enter(e) {
                if (e.keyCode === 13) {
                    document.removeEventListener('keyup', enter);
                    loop = "running";
                    reset();
                }
            });
        }, 1)
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
         
        // Drawing a rectangle gradient before rendering the images as a sky-box.
        var grd=ctx.createLinearGradient(0,0,0,50);
        grd.addColorStop(0,"#00ace6");
        grd.addColorStop(1,"#00bfff");

        ctx.fillStyle=grd;
        ctx.fillRect(0,0,707,100);

        var doorClosed = 'images/door-closed.png';
        var doorOpen = 'images/door-open.png';

        var rowImages = [
                'images/water-block.png',   
                'images/grass-block.png',   
                'images/grass-block.png',   
                'images/stone-block.png',   
                'images/stone-block.png',   
                'images/stone-block.png',   
                'images/grass-block.png' 
            ],
            numRows = 7,
            numCols = 7,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        // Top portion of the map drawn here in three parts.
        for (col = 0; col < 3; col++) {
            ctx.drawImage(Resources.get(rowImages[0]), col * 101, 0);
        }
        ctx.drawImage(Resources.get(rowImages[1]), col * 101, 0);
        for (col = 4; col < 7; col++) {
            ctx.drawImage(Resources.get(rowImages[0]), col * 101, 0);
        }
        
        // Main bulk of the map drawn here.
        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */       
        damsel[0].render();
        
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        
        obstacleRenderArray.forEach(function(obstacle) {
            obstacle.render();
        });
        gate.forEach(function(gate) {
            gate.render();
        });

        player.render();

        key.forEach(function(key) {
            key.render();
        })

        indicator.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        key = [];
        gate = [];
        damsel = [];
        allEnemies = [];
        obstacleRenderArray = [];
        allObstacles = [];
        startUp();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/key.png',
        'images/wall.png',
        'images/door-open.png',
        'images/door-closed.png',
        'images/rock.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);