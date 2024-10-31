// Function to enable particles and save the state in localStorage
function enableParticles() {
    localStorage.setItem('particles', 'true');
    window.location.reload();
}

// Function to disable particles and save the state in localStorage
function disableParticles() {
    localStorage.setItem('particles', 'false');
    window.location.reload();
}

// Number of particles to generate
const numberOfParticles = 50;

// Get the particles container
const particlesContainer = document.querySelector('.particles-container');

// Function to generate particles
function generateParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        // Create a new particle element
        const particle = document.createElement('div');
        // Add the 'particle' class to the particle element
        particle.classList.add('particle');
        // Set the initial position of the particle to the bottom of the page
        particle.style.bottom = '0';
        // Randomly set the horizontal position of the particle
        particle.style.left = Math.random() * 100 + '%';
        // Randomly set the animation duration for each particle
        particle.style.animationDuration = Math.random() * 5 + 3 + 's';
        // Append the particle to the particles container
        particlesContainer.appendChild(particle);
    }
}

// Check if particles are enabled or disabled in localStorage
const particlesEnabled = localStorage.getItem('particles') === 'true';

// Enable or disable particles based on localStorage value
if (particlesEnabled) {
    console.log('Particles are enabled');
    generateParticles();
} else {
    console.log('Particles are disabled');
}
