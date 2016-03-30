// Clamp method used to confine player movement to the map.
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// Random number generator generates number between 0 and 2.
// It is used in giving the Enemies randomised speed and 'y' value.
var random = function() {
    return Math.floor( Math.random() * 3);
}

// Indicator prototype for the event when the player has the key.
var Indicator = function(status) {
    this.x = -5;
    this.y = -20; //590;
    this.sprite = "images/key.png";
    this.status = status;
}

Indicator.prototype.render = function() {
    if (this.status === "on") {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 85);
    }
}

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+=(this.speed*dt*150);

    for (enemy in allEnemies) {
        if (allEnemies[enemy].x > 808) {
            allEnemies[enemy].x = -101;
            allEnemies[enemy].y = 213+(81*random());
            allEnemies[enemy].speed = random() + 1;
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
    this.hasKey = false;
}

// Player.update method is not used, collision is monitored in another way.
/*
Player.prototype.update = function(dt) {

}
*/

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player controls. Also checks for collision with obstacles and prevents the player to step on them.
// It checks player future position to prevent a rubberband effect (where the player sprite is set back).
Player.prototype.handleInput = function(key) {
    var x = this.x;
    var y = this.y;

    if (key === "up") {
        if (checkCollisions(allObstacles, x, y-81, 0) === true) {
            this.y = y;
        } else {
            this.y = (y - 81).clamp(-30, 456);
        }
    }
    if (key === "down") {
        if (checkCollisions(allObstacles, x, y+81, 0) === true) {
            this.y = y;
        } else {
            this.y = (y + 81).clamp(-30, 456);
        }
    }
    if (key === "left") {
        if (checkCollisions(allObstacles, x-101, y, 0) === true) {
            this.x = x;
        } else {
            this.x = (x - 101).clamp(0, 606);
        }
    }
    if (key === "right") {
        if (checkCollisions(allObstacles, x+101, y, 0) === true) {
            this.x = x;
        } else {
            this.x = (x + 101).clamp(0, 606);
        }
    }
}

var Damsel = function(x, y) {
    this.sprite = "images/char-cat-girl.png";
    this.x = x;
    this.y = y;
}

Damsel.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Obstacle = function(id, x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.id = id;
}

// Because not every obstacle has a sprite, the render method works only when there is an image defined.
Obstacle.prototype.render = function() {
    if (this.sprite != undefined) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

var Gate = function (x, y, position) {
    this.x = x;
    this.y = y;
    this.id = "gate";
    this.position = position;
}

Gate.prototype.render = function() {
    if (this.position === "closed") {
        ctx.drawImage(Resources.get("images/door-closed.png"), this.x, this.y);
    } else if (this.position === "open"){
        ctx.drawImage(Resources.get("images/door-open.png"), this.x, this.y);
    }
}

var Key = function(x, y) {
    this.sprite = "images/key.png";
    this.x = x;
    this.y = y;
}

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player;
var key = [];
var gate = [];
var damsel = [];
var allEnemies = [];
// This array store the information for rendering the obstacles.
var obstacleRenderArray = [];
// This array stores the collision boxes of the obstacles.
var allObstacles = [];

// These functions create various objects and pushing them into their respective arrays.


var createEnemy = function() { 
    allEnemies.push(new Enemy (-101, 213+(81*random()), random()));
}

var createObstacle = function(id, x, y, sprite, offset) { 
    obstacleRenderArray.push(new Obstacle (id, x, y, sprite));
    // Because of the position of the wall the y value of its collision box has to be corrected, hence the offset variable.
    allObstacles.push(new Obstacle (id, x, y + offset));
}

var createGate = function(id, x, y, offset, position) {
    gate.push(new Gate (x, y, position));
    allObstacles.push(new Obstacle (id, x, y + offset));   
}

var createKey = function(x, y) {
    key.push(new Key (x,y));
}

// This function creates a player character.
var startUp = function () {
    console.log("Initating the game...");

    var createPlayer = (function(x, y) {
        console.log("Creating Hero...");
        player = new Player (x, y);
    })(303, 456);

    var createDamsel = (function(x, y) { 
        console.log("Kidnapping Damsel...");
        damsel.push(new Damsel (x,y));
    })(303, -30);

    var createIndicator = (function(status) {
        console.log("Setting the indicator...");
        indicator = new Indicator (status);
    })("off");


    // This function calls itself and build the wall on the top of the map.
    var buildWall = (function() {
        console.log("Building the walls...");
        var x = 0;
        var y = 83;
        for (i = 0; i < 3; i++) {
            createObstacle("wall", x, y, "images/wall.png", -32);
            x += 101;
        }
        createGate("gate", 303, 83, -32, "closed")
        x = 404;
        for (i = 0; i < 3; i++) {
            createObstacle("wall", x, y, "images/wall.png", -32);
            x += 101;
        }
    })();

    var placeRocks = (function(number) {
        console.log("Placing the rocks...");
        for (i = 0; i < number; i++) {
            var x = Math.floor( Math.random() * 7)*101;
            var y = 213+(81*random());
            createObstacle("rock", x, y, "images/rock.png", 0)
        }
    })(3);

    // This creates collision boxes for the water blocks, already rendered on the map.
    var fillTrench = (function() {
        console.log("Filling the trenches...");
        var x = 0;
        var y = -30;
        for (i = 0; i < 3; i++) {
            createObstacle("water", x, y, undefined, 0);
            x += 101;
        }
        x = 404;
        for (i = 0; i < 3; i++) {
            createObstacle("water", x, y, undefined, 0);
            x += 101;
        }
    })();

    // This function drops a key onto the map to a place where no obstacles are present.
    var dropKey = (function() {
        console.log("Dropping the key...");
        var x = Math.floor( Math.random() * 7)*101;
        var y = 213+(81*random());
        
        var allRocksX = [],
            allRocksY = [];

        for (obstacle in allObstacles) {
            if (allObstacles[obstacle].id === "rock") {
                allRocksX.push(allObstacles[obstacle].x);
                allRocksY.push(allObstacles[obstacle].y);
            }
        }
        
        // This function checks the x and y cooridantes of the rocks,
        // and either drops the key to a vacant position, or generates a new x cooridnate
        // and re-runs the test.
        var checkRocks = function() {
            if (allRocksX.indexOf(x) < 0) {
                createKey(x, y);           
            } else if (allRocksY.indexOf(y) < 0) {
                createKey(x, y);
            } else {
                console.log("Key dropped on a rock, checking for a new place...");
                x = Math.floor( Math.random() * 7)*101;
                checkRocks();
            }
        }
        checkRocks();
    })();

    // This function takes in a number and runs the createEnemy function as many times.
    // For now it is calling itself, automatically initating the game.
    // Later it can be used for difficulty management or a Start button.
    var initEnemies = (function(number) {
        console.log("Releasing all the bugs...");
        for (i = 0; i < number; i++) {
            createEnemy();
        }
    })(5);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        65: 'left',
        38: 'up',
        87: 'up',
        39: 'right',
        68: 'right',
        40: 'down',
        83: 'down'
    };
    if (player != undefined) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

// Checks if the player and an object from a given array collide.
// It approximates each object's position to a 7 column grid.
// Actual player coordinates are replaced with variables, so handleInput can check future positions.
// xModifer variable is passed to correct the hitbox of the enemy bugs.
var checkCollisions = function(array, playerX, playerY, xModifier) {
    for (object in array) {
        if ((playerX/101) === Math.floor(Math.floor(array[object].x + xModifier)/101) && playerY === array[object].y) {
            console.log("Looks like you bumped into something...");
            return true;
        }
    }
}