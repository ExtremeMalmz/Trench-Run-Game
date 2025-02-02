
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

//array of obstacles like asteroids tie fighters
let obstacleArray = [];

let obstacle1Width = 34;
let obstacle2Width = 69;
let obstacle3Width = 102;

let obstacleHeight = 70;
let obstacleX = 1700;
let obstacleY = boardHeight - obstacleHeight;

let obstacle1Img;
let obstacle2Img;
let obstacle3Img;

//physics
let velocityX = -8; //obstacle moving left speed
let velocityY = 0;
let gravity = 0;

let gameOver = false;
let gottenToEndOfGame = false;
//the time spent playing (1500 original value)
let time = 1500;

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

//places the reactor
let placedReactor = false;
let completedTutorial = false;

function startGame(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    spaceShipImg = new Image();
    spaceShipImg.src = "./img/XWing1.png";
    spaceShipImg.onload = function() {
        context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);
    }

    obstacle1Img = new Image();
    obstacle1Img.src = "./img/asteroid1.png";

    obstacle2Img = new Image();
    obstacle2Img.src = "./img/tiefighter1.png";

    obstacle3Img = new Image();
    obstacle3Img.src = "./img/tiefighter2.png";

    reactorImg = new Image();
    reactorImg.src = "./img/Reactor.png";

    requestAnimationFrame(update);
    if(time >= 100){
        //spawn the obstacles only when time is greater than 100, for the reactor
        setInterval(placeCactus, 500); //1000 milliseconds = 1 second
    }
    
    document.addEventListener("keydown", moveSpaceShip);
}

let timer = 0;

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        timer++;

        if(timer >= 100){
            window.location.href = "./GameOver/index.html"
        }
        
        return; 
    }
    
    if(time <= 0){
        gottenToEndOfGame = true;

        //console.log("Reached end!");
        if(!placedReactor){
            obstacleArray = [];
            placeReactorCore();
        }
        else{
        }
        placedReactor = true;

        velocityX = 0;
    }
    context.clearRect(0, 0, board.width, board.height);

    if(!gottenToEndOfGame){
        //console.log("increase");
    // Increase obstacle speed as score increases
     velocityX = -20 - Math.floor((3000 - time) / 250); // Increase speed every 250 time units

    }
    else{
        velocityX = 0;
    }

    context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);

    //Collisions
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacleInArray = obstacleArray[i];
        
        obstacleInArray.x += velocityX;
        context.drawImage(obstacleInArray.img, obstacleInArray.x, obstacleInArray.y, obstacleInArray.width, obstacleInArray.height);

  

        if (detectCollision(spaceShip, obstacleInArray)) {
            gameOver = true;
            spaceShipImg.src = "./img/Explosion.png";
            spaceShipImg.onload = function() {
                context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);
            }
        }

        for (let j = 0; j < projectiles.length; j++) {
            let projectile = projectiles[j];
            if (detectCollision(projectile, obstacleInArray) && gottenToEndOfGame == false ) {
                //console.log("hit");
                // Remove the obstacle and projectile on collision
                obstacleArray.splice(i, 1);  
                projectiles.splice(j, 1);  
                i--;  
                break;  
            }
            //if it comes here its the reactor
            else if(detectCollision(projectile, obstacleInArray) && gottenToEndOfGame == true){
                obstacleInArray.img = new Image();
                obstacleInArray.img.src = "./img/Explosion.png";
                
                projectiles.splice(j, 1);  // Remove projectile
                i--;  // Adjust index after removing obstacle
               // console.log("X");

                board = document.getElementById("board");
    

                // Set background image in JavaScript
                board.style.backgroundColor = "red";

                
        // Start the fade-out effect
        // Call the function to start the fade-out process when the page loads
        fadeToBlack();
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
        //console.log("fire");
    }
    // Fire double shot
    else if (e.code == "KeyX") {
        shootDoubleProjectile();
        //console.log("Proton torbedoes!");
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
}

function placeReactorCore() {   
    //create the thingy here gonna sleep on it
  
        // Create the reactor object for the reactor
        let reactor = {
            img: reactorImg,                
            x: boardWidth / 2 - obstacle2Width / 2,
            y: boardHeight / 2 - obstacleHeight / 2, 
            width: obstacle2Width,           
            height: obstacleHeight            
        };

        obstacleArray.push(reactor);
}

function placeCactus() {
    if (gameOver || gottenToEndOfGame) {
        return; // Stop placing obstacles when time is 0 or game is over
    }    

    // Define the possible spawn heights for the obstacle (top, middle, bottom)
    const spawnPositions = [
        0,                           // Top of the board
        boardHeight / 2 - obstacleHeight / 2, // Middle of the board
        boardHeight - obstacleHeight  // Bottom of the board
    ];

    // Randomly select one of the positions
    const randomY = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];

    // Place obstacle
    let obstacle = {
        img: null,
        x: obstacleX,
        y: randomY,  // Assign the randomly selected position
        width: null,
        height: obstacleHeight
    };

    let placeCactusChance = Math.random(); //0 - 0.9999...

    //here we determine the spawn rate
    if (placeCactusChance > 0.90) { 
        obstacle.img = obstacle3Img;
        obstacle.width = obstacle3Width;
        obstacleArray.push(obstacle);
    // 30% chance you get obstacle2
    } else if (placeCactusChance > 0.70) { 
        obstacle.img = obstacle2Img;
        obstacle.width = obstacle2Width;
        obstacleArray.push(obstacle);
    // 50% chance you get obstaclee3
    } else if (placeCactusChance > 0.50) { 
        obstacle.img = obstacle1Img;
        obstacle.width = obstacle1Width;
        obstacleArray.push(obstacle);
    }

    // Prevent the array from growing infinitely
    if (obstacleArray.length > 5) {
        obstacleArray.shift(); // Remove the first element from the array
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


function closeTutorial(){
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
    
    startGame();
}