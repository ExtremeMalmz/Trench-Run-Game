var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
//velocityX = velocityX - slider.value;
let sliderValue = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

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
let score = 0;

// Projectiles
let projectiles = [];
let projectileWidth = 20;
let projectileHeight = 10;
let projectileSpeed = 10;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

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

//this is where the game magic happens
function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    //velocityY += gravity;
    //spaceship
    context.drawImage(spaceShipImg, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);
    

    //cactus
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
        context.fillStyle = "red";
        context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }

    

    //checks if the velocity slidervalue has been increased
    if(sliderValue != slider.value){
        velocityX = -Math.abs(slider.value) - 8;
        console.log("new velcoity" + velocityX)

        let sliderBonus = Math.floor(slider.value / 10); // Normalize slider value (1-50 -> 0.1-5 bonus)
        score += 1 + sliderBonus; // Base score increment + bonus

    }

    //if the score is over 1000 OR WHATEVER IT IS spawn the yellow
    if (score >= 1000) {
        // Draw a yellow wall across the entire canvas

        //make text fade and stuff
        context.fillStyle = "yellow";
        context.fillRect(0, 0, 200, boardHeight); // 200px wide, full board height
        context.fillStyle = "black";
        context.font = "30px courier";
        context.fillText("YELLOW WALL!", boardWidth / 2 - 100, boardHeight / 2);
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
   
}

// Movement and shooting
function moveSpaceShip(e) {
    if (gameOver) {
        return;
    }

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
}

// New function to shoot a projectile
function shootProjectile() {
    if (gameOver) {
        return;
    }

    let projectile = {
        x: spaceShip.x + spaceShip.width, // Start at the right edge of the dino
        y: spaceShip.y + spaceShip.height / 2 - projectileHeight / 2, // Centered vertically
        width: projectileWidth,
        height: projectileHeight
    };

    projectiles.push(projectile); // Add the projectile to the array
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
