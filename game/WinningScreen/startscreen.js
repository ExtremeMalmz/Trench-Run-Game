window.onload = function() {
    var scrollingText = document.getElementById('scrollingText');
    var scrollingTextContainer = document.getElementById('scrollingTextContainer');
    
    // Get the height of the content (all paragraphs inside #scrollingText)
    var contentHeight = scrollingText.scrollHeight; 
    
    // Set the container height dynamically (in case it's not fixed)
    scrollingTextContainer.style.height = contentHeight + 'px';

    // Calculate animation duration based on content height
    var duration = contentHeight / 50; // You can tweak this divisor to control the speed
    scrollingText.style.animationDuration = duration + 's'; // Set animation duration dynamically

    // Add the animation to scrollingText
    scrollingText.style.animation = 'scrollText ' + duration + 's linear forwards';
};

// Wait for 60 seconds and then fade the image
setTimeout(function() {
    // Add the fade class to the image after 1 minute
    fadeToBlack();
}, 18000); // 60000 milliseconds = 60 seconds = 1 minute

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
            //where you want it to go
            window.location.href = "../Credits/index.html"
        }
    }

    // Begin fading out to black
    fadeEffect();
}