function startGame(){
    let playerName = document.getElementById('playerName').value;

    //console.log(playerName);
    if(playerName === ""){
        //if playername is empty
        window.alert("Young Jedi, don't forget to enter your name!\nIts in the middle of the text");
        console.log("cant have that");
    }
    else{
    //name is good start the game    
    window.location.href = "../game/index.html"
    }

}

/*
let audio = new Audio('Star-Wars-Disco.mp3');
    audio.loop = true; // Enable looping
audio.play();
*/