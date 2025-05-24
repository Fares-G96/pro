// Function to generate a random number between min and max values
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to animate the bubbles in the banner
function animateBubbles() {
    // Get all bubble elements
    const bubbles = document.querySelectorAll('.bubble');
    
    // Apply animation to each bubble
    bubbles.forEach(bubble => {
        // Set initial random position
        const startX = getRandomNumber(-100, window.innerWidth);
        const startY = getRandomNumber(-100, window.innerHeight);
        
        // Set random movement speed for each bubble
        const speedX = getRandomNumber(-2, 2);
        const speedY = getRandomNumber(-2, 2);
        
        // Set initial position
        bubble.style.left = `${startX}px`;
        bubble.style.top = `${startY}px`;
        
        // Function to animate individual bubble
        function moveBubble() {
            // Get current position
            const currentX = parseFloat(bubble.style.left);
            const currentY = parseFloat(bubble.style.top);
            
            // Calculate new position
            let newX = currentX + speedX;
            let newY = currentY + speedY;
            
            // Bounce off edges of the screen
            if (newX < -100 || newX > window.innerWidth) {
                newX = getRandomNumber(-100, window.innerWidth);
            }
            if (newY < -100 || newY > window.innerHeight) {
                newY = getRandomNumber(-100, window.innerHeight);
            }
            
            // Update bubble position
            bubble.style.left = `${newX}px`;
            bubble.style.top = `${newY}px`;
            
            // Continue animation
            requestAnimationFrame(moveBubble);
        }
        
        // Start animation for this bubble
        moveBubble();
    });
}

// Function to create typing animation effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = ''; // Clear the text
    
    // Function to type each character
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Start typing animation
    type();
}

// Start all animations when page loads
window.addEventListener('load', () => {
    // Start bubble animations
    animateBubbles();
    
    // Start typing animation for name
    const nameElement = document.querySelector('.name');
    typeWriter(nameElement, 'Fares Abdel Sattar', 150);
}); 
