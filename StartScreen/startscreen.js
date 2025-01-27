function startGame(){
    
    //name is good start the game    
    window.location.href = "../game/index.html"
  

}

/*
let audio = new Audio('Star-Wars-Disco.mp3');
    audio.loop = true; // Enable looping
audio.play();
*/


window.onload = function() {
    var scrollingText = document.getElementById('scrollingText');
    var scrollingTextContainer = document.getElementById('scrollingTextContainer');
    
    // Get the height of the content (all paragraphs inside #scrollingText)
    var contentHeight = scrollingText.scrollHeight; 
    
    // Set the container height dynamically (in case it's not fixed)
    scrollingTextContainer.style.height = contentHeight + 'px';

    // Calculate animation duration based on content height
    var duration = contentHeight / 20; // You can tweak this divisor to control the speed
    scrollingText.style.animationDuration = duration + 's'; // Set animation duration dynamically

    // Add the animation to scrollingText
    scrollingText.style.animation = 'scrollText ' + duration + 's linear forwards';
};
