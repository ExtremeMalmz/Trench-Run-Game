
//board
let board;
let boardWidth = 1350;
let boardHeight = 315;
let context;

//spaceship
let spaceShipWidth = 88;
let spaceShipHeight = 94;
let spaceShipX = 50;
let spaceShipY = boardHeight - spaceShipHeight;
let spaceShipImg;

let spaceShip = {
    x : spaceShipX,
    y : spaceShipY,
    width : spaceShipWidth,
    height : spaceShipHeight
}

//explosion
let explosionImg;

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 1700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0;

let gameOver = false;
let gottenToEndOfGame = false;
//the time spent playing (2500)
let time = 1000;

// Projectiles
let projectiles = [];
let projectileWidth = 20;
let projectileHeight = 10;
let projectileSpeed = 10;

//laser
let laser = {
    x: spaceShip.x + spaceShip.width, // Start at the right edge of the dino
    y: spaceShip.y + spaceShip.height / 2 - projectileHeight / 2, // Centered vertically
    width: projectileWidth,
    height: projectileHeight
};

let placedReactor = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    spaceShipImg = new Image();
    spaceShipImg.src = "./img/XWing.png";
    spaceShipImg.onload = function() {
        context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/asteroid.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveSpaceShip);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return; // Stop placing cactuses when time is 0 or game is over
    }
    if(time <= 0){
        gottenToEndOfGame = true;

        console.log("Reached end!");
        if(!placedReactor){
            placeReactorCore();
        }
        else{

        }
        placedReactor = true;

        velocityX = 0;
       
    }

    
    context.clearRect(0, 0, board.width, board.height);

    if(!gottenToEndOfGame){
        console.log("increase");
// Increase cactus speed as score increases
     velocityX = -20 - Math.floor((2500 - time) / 250); // Increase speed every 250 time units

    }
    else{
        velocityX = 0;
    }
     
    //velocityY += gravity;
    //spaceship
    context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);

    //Collisions
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

  

        if (detectCollision(spaceShip, cactus)) {
            gameOver = true;
            spaceShipImg.src = "./img/Explosion.png";
            spaceShipImg.onload = function() {
                context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);
            }
        }

        for (let j = 0; j < projectiles.length; j++) {
            let projectile = projectiles[j];
            if (detectCollision(projectile, cactus) && gottenToEndOfGame == false ) {
                console.log("hit");
                // Remove the cactus and projectile on collision
                cactusArray.splice(i, 1);  // Remove cactus
                projectiles.splice(j, 1);  // Remove projectile
                i--;  // Adjust index after removing cactus
                break;  // Exit inner loop after collision
            }
            //if it comes here its the reactor
            else if(detectCollision(projectile, cactus) && gottenToEndOfGame == true){
                cactus.img = new Image();
                cactus.img.src = "./img/Explosion.png";
                //cactusArray.splice(i, 1);  // Remove cactus
                projectiles.splice(j, 1);  // Remove projectile
                i--;  // Adjust index after removing cactus
                console.log("X");

                board = document.getElementById("board");
    

    // Set background image in JavaScript
                board.style.backgroundColor = "red";
                 // Set the image of the cactus to the explosion image

                
        // Start the fade-out effect
        // Call the function to start the fade-out process when the page loads
        fadeToBlack();
        console.log("yo");

                
            }
            
        }
    }

    

      // Move and render projectiles
      for (let i = 0; i < projectiles.length; i++) {
        let projectile = projectiles[i];
        projectile.x += projectileSpeed;

        // Remove projectiles that go off the screen
        if (projectile.x > boardWidth) {
            projectiles.splice(i, 1);
            i--;
            continue;
        }

        // Draw projectile
        context.fillStyle = "green";
        context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }

        //fills the text with the time countdown or reached reactor
        context.fillStyle="black";
        context.font="20px courier";
        time--;
        if(!gottenToEndOfGame){
            context.fillText("Distance to reactor: " + time, 5, 20);
        }
        else{
            context.fillText("Reached Reactor!", 5, 20);
        }
}

function fadeToBlack() {
    let body = document.body; // The entire body of the page

    let opacity = 1; // Start with full opacity
    let fadeSpeed = 0.02; // Speed of the fade-out (adjust as needed)

    // Start the fade effect
    function fadeEffect() {
        opacity -= fadeSpeed; // Decrease opacity
        opacity = Math.max(0, opacity); // Prevent opacity from going below 0

        // Gradually change the background color from white to black
        let red = Math.floor(255 * opacity);  // Start with white (255, 255, 255) and fade to black (0, 0, 0)
        let green = Math.floor(255 * opacity);
        let blue = Math.floor(255 * opacity);

        // Apply the new background color
        body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        body.style.opacity = opacity;

        // Continue fading until opacity reaches 0
        if (opacity > 0) {
            requestAnimationFrame(fadeEffect); // Continue the fade effect
        } else {
            window.location.href = "./WinningScreen/index.html"
        }
    }

    // Begin fading out to black
    fadeEffect();
}

// Movement and shooting
function moveSpaceShip(e) {
    // Move up
    if ((e.code == "KeyW" || e.code == "ArrowUp")) {
        if(spaceShip.y > 1){
            //move spaceship up 20 pixels
            spaceShip.y = spaceShip.y - 20;
        }
        else{
            //console.log("Out of bounds");
        }
    } 
    // Move down
    else if (e.code == "KeyS" || e.code == "ArrowDown") {
        if(spaceShip.y < 221){
            //move spaceship down 20 pixels
            spaceShip.y = spaceShip.y + 20
        }
        else{
            //console.log("Out of bounds");
        }
    }
    else if (e.code == "Space") {
        // Shoot when "S" is pressed
        shootProjectile();
        console.log("fire");
    }
    // Fire double shot
    else if (e.code == "KeyX") {
        shootDoubleProjectile();
        console.log("Proton torbedoes!");
    }
}

// New function to shoot a projectile
function shootProjectile() {
    let newLaser = {
        x: spaceShip.x + spaceShip.width, // Start at the right edge of the spaceship
        y: spaceShip.y + spaceShip.height / 2 - projectileHeight / 2, // Centered vertically
        width: projectileWidth,
        height: projectileHeight
    };
    projectiles.push(newLaser); // Add the new projectile to the array

    //projectiles.push(laser); // Add the projectile to the array
}

function placeReactorCore() {   
    //create the thingy here gonna sleep on it
  
        // Create the cactus object for the reactor
        let reactorCactus = {
            img: cactus2Img,                // Use the cactus2 image (or any image you prefer)
            x: boardWidth / 2 - cactus2Width / 2, // Position it horizontally in the center of the board
            y: boardHeight / 2 - cactusHeight / 2, // Position it vertically in the middle of the board
            width: cactus2Width,            // Use cactus2's width
            height: cactusHeight            // Use cactus height
        };

       cactusArray.push(reactorCactus);
    
}


function placeCactus() {
    if (gameOver || gottenToEndOfGame) {
        return; // Stop placing cactuses when time is 0 or game is over
    }
    

    // Define the possible spawn heights for the cactus (top, middle, bottom)
    const spawnPositions = [
        0,                           // Top of the board
        boardHeight / 2 - cactusHeight / 2, // Middle of the board
        boardHeight - cactusHeight  // Bottom of the board
    ];

    // Randomly select one of the positions
    const randomY = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];

    // Place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: randomY,  // Assign the randomly selected position
        width: null,
        height: cactusHeight
    };

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > 0.90) { // 10% chance you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) { // 30% chance you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.50) { // 50% chance you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    // Prevent the array from growing infinitely
    if (cactusArray.length > 5) {
        cactusArray.shift(); // Remove the first element from the array
    }
}


function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}


function shootDoubleProjectile() {
    // Create the top projectile
    let topLaser = {
        x: spaceShip.x + spaceShip.width, // Start at the right edge of the spaceship
        y: spaceShip.y,                  // Top edge of the spaceship
        width: projectileWidth,
        height: projectileHeight
    };

    // Create the bottom projectile
    let bottomLaser = {
        x: spaceShip.x + spaceShip.width, // Start at the right edge of the spaceship
        y: spaceShip.y + spaceShip.height - projectileHeight, // Bottom edge of the spaceship
        width: projectileWidth,
        height: projectileHeight
    };

    // Add both projectiles to the array
    projectiles.push(topLaser);
    projectiles.push(bottomLaser);
}

//heres for mobile
// Wait for the DOM to fully load before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Select buttons by their ID
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');

    // Check if buttons exist before adding event listeners
    if (button1) {
        //moves up
        button1.addEventListener('click', () => {
            const simulatedEvent = new KeyboardEvent('keydown', {
                key: 'w',          // Key 'w' simulates the move up
                code: 'KeyW',      // Use the code for the 'w' key
            });

            // Call moveSpaceShip with the simulated event
            moveSpaceShip(simulatedEvent);

        });
    }

    //moves down
    if (button2) {
        button2.addEventListener('click', () => {
            const simulatedEvent = new KeyboardEvent('keydown', {
                key: 's',          // Key 'w' simulates the move up
                code: 'KeyS',      // Use the code for the 'w' key
            });
        
        moveSpaceShip(simulatedEvent);
        });
    }

    if (button3) {
        //fires
        button3.addEventListener('click', () => {
            const simulatedEvent = new KeyboardEvent('keydown', {
                key: ' ',         // Key ' ' simulates the spacebar
                code: 'Space',    // Use the code for the spacebar key
            });
        
        moveSpaceShip(simulatedEvent);
        });
    }
});
