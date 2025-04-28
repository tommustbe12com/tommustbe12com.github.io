// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#34d399' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#34d399',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Create parallax effect
const scene = document.getElementById('scene');
const parallaxInstance = new Parallax(scene, {
    relativeInput: true,
    clipRelativeInput: true
});

// Add floating shapes to the hero section
function createShapes() {
    const scene = document.querySelector('.parallax');
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.width = Math.random() * 300 + 100 + 'px';
        shape.style.height = shape.style.width;
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        scene.appendChild(shape);
    }
}

createShapes();

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll-based navbar transparency
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.background = 'rgba(17, 24, 39, 0.8)';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
    }

    lastScroll = currentScroll;
});

// Existing script content
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const broughtFrom = getQueryParam("broughtFrom");
if (broughtFrom === "blackBeltGame") {
    alert("Hello! Welcome to my site. It looks like you came here from my Black Belt Game! Have fun exploring my site!");

    const encodedWebhookUrl = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMzOTI4MTExMDIzNjEzNTU0NC9kRzA4cmpDOGpXVkIzNFNuSXVjbF9ua1I3OTh1M0I2dmtmcnNUNWdSY3dGVExXRkNlRXRpbzYwS1lnX0xoczkycnpnLQ==";
    const webhookUrl = atob(encodedWebhookUrl);

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "User came from Black Belt Game!" })
    });
} else if (broughtFrom === "senseiGameJam") {
    alert("Hello! Welcome to my site. It looks like you came here from my Sensei Game Jam Game! Have fun exploring my site!");

    const encodedWebhookUrl = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMzOTI4MTExMDIzNjEzNTU0NC9kRzA4cmpDOGpXVkIzNFNuSXVjbF9ua1I3OTh1M0I2dmtmcnNUNWdSY3dGVExXRkNlRXRpbzYwS1lnX0xoczkycnpnLQ==";
    const webhookUrl = atob(encodedWebhookUrl);

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "User came from Sensei Game Jam Game!" })
    });
}