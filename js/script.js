// YouTube Player variables
let player;
let videoId = 'xnn7QigAaeM'; // Minecraft background video ID - replace with your preferred video
let isMuted = true;

// Loader Animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader-container');
    setTimeout(function() {
        loader.classList.add('loader-hidden');
    }, 1500); // Show loader for at least 1.5 seconds
});

// Initialize YouTube API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            mute: 1,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            vq: 'hd1080',
            rel: 0,
            playsinline: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// When player is ready
function onPlayerReady(event) {
    event.target.playVideo();
    event.target.mute();
    
    // Resize the player to cover the viewport
    resizePlayer();
    window.addEventListener('resize', resizePlayer);
    
    // Setup video controls
    setupVideoControls();
}

// When player state changes
function onPlayerStateChange(event) {
    // If video ends, restart it
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

// Setup video controls
function setupVideoControls() {
    // Mute/Unmute button
    const toggleSoundBtn = document.getElementById('toggle-video-sound');
    if (toggleSoundBtn) {
        toggleSoundBtn.addEventListener('click', function() {
            if (isMuted) {
                player.unMute();
                player.setVolume(50); // Set to 50% volume
                toggleSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                isMuted = false;
            } else {
                player.mute();
                toggleSoundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isMuted = true;
            }
        });
    }
    
    // Video selector options
    const videoOptions = document.querySelectorAll('.video-option');
    videoOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newVideoId = this.getAttribute('data-video-id');
            if (newVideoId && newVideoId !== videoId) {
                videoId = newVideoId;
                
                // Add transition effect
                const playerElement = document.getElementById('youtube-player');
                if (playerElement) {
                    playerElement.classList.add('video-transition');
                    setTimeout(() => {
                        playerElement.classList.remove('video-transition');
                    }, 1000);
                }
                
                // Load and play the new video
                player.loadVideoById({
                    videoId: videoId,
                    startSeconds: 0,
                    suggestedQuality: 'hd1080'
                });
                
                // Maintain mute state
                if (isMuted) {
                    player.mute();
                } else {
                    player.unMute();
                    player.setVolume(50);
                }
                
                // Update the player's loop playlist
                player.setLoop(true);
                player.cuePlaylist({
                    playlist: videoId,
                    listType: 'playlist',
                    index: 0,
                    suggestedQuality: 'hd1080'
                });
                
                // Show visual feedback for selected option
                videoOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Resize player to maintain aspect ratio while covering the viewport
function resizePlayer() {
    if (!player) return;
    
    const videoRatio = 16 / 9;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    
    let newWidth, newHeight;
    
    if (windowRatio > videoRatio) {
        newWidth = windowWidth;
        newHeight = windowWidth / videoRatio;
    } else {
        newWidth = windowHeight * videoRatio;
        newHeight = windowHeight;
    }
    
    const playerElement = document.getElementById('youtube-player');
    if (playerElement) {
        playerElement.style.width = newWidth + 'px';
        playerElement.style.height = newHeight + 'px';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements as they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-in:not(.animate-active)');
        const windowHeight = window.innerHeight;
        
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('animate-active');
            }
        });
    };
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // Plan Toggle Functionality
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('yearly-billing');
            } else {
                document.body.classList.remove('yearly-billing');
            }
        });
    }
    
    // Add dark mode glow effects
    function addGlowEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .glow-effect {
                box-shadow: 0 0 15px var(--primary-color);
                animation: glow-pulse 3s infinite;
            }
            
            @keyframes glow-pulse {
                0% {
                    box-shadow: 0 0 5px var(--primary-color);
                }
                50% {
                    box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--secondary-color);
                }
                100% {
                    box-shadow: 0 0 5px var(--primary-color);
                }
            }
            
            .dark-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            
            .dark-particle {
                position: absolute;
                width: 2px;
                height: 2px;
                background-color: var(--primary-color);
                border-radius: 50%;
                box-shadow: 0 0 10px 2px var(--primary-color);
                animation: dark-particle-float linear infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Add glow effect to buttons and important elements
        document.querySelectorAll('.btn-primary, .logo h1, .popular-tag').forEach(el => {
            el.classList.add('glow-effect');
        });
        
        // Create dark mode particles
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'dark-particles';
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'dark-particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation duration and delay
            const duration = Math.random() * 60 + 30;
            const delay = Math.random() * 60;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Random color (primary or secondary)
            if (Math.random() > 0.7) {
                particle.style.backgroundColor = 'var(--secondary-color)';
                particle.style.boxShadow = '0 0 10px 2px var(--secondary-color)';
            }
            
            particlesContainer.appendChild(particle);
        }
        
        // Add keyframes for particles
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes dark-particle-float {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-${Math.random() * 1000 + 500}px) translateX(${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(keyframes);
    }
    
    // Add dark mode effects
    addGlowEffects();
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const ctaButtons = document.querySelector('.cta-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile nav if it doesn't exist
            if (!document.querySelector('.mobile-nav')) {
                const mobileNav = document.createElement('div');
                mobileNav.classList.add('mobile-nav');
                
                // Clone navigation links
                const navClone = navLinks.cloneNode(true);
                mobileNav.appendChild(navClone);
                
                // Clone CTA buttons
                const ctaClone = ctaButtons.cloneNode(true);
                mobileNav.appendChild(ctaClone);
                
                // Add to body
                document.body.appendChild(mobileNav);
                
                // Add styles for mobile nav
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-nav {
                        position: fixed;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        background-color: var(--dark-color);
                        padding: 20px;
                        box-shadow: 0 5px 10px rgba(0,0,0,0.3);
                        z-index: 99;
                        display: none;
                        flex-direction: column;
                        gap: 30px;
                        border-top: 1px solid var(--primary-color);
                    }
                    
                    .mobile-nav .nav-links {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .mobile-nav .cta-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .hamburger.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                        background-color: var(--primary-color);
                    }
                    
                    .hamburger.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .hamburger.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -6px);
                        background-color: var(--primary-color);
                    }
                    
                    .mobile-nav.active {
                        display: flex;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Toggle mobile nav
            const mobileNav = document.querySelector('.mobile-nav');
            mobileNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
            }
        });
    });
    
    // Dynamic Minecraft block animations
    function createMinecraftBlocks() {
        const blockTypes = ['dirt', 'stone', 'grass', 'diamond'];
        const blockContainer = document.createElement('div');
        blockContainer.className = 'minecraft-blocks-container';
        
        const style = document.createElement('style');
        style.textContent = `
            .minecraft-blocks-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            
            .minecraft-block {
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                opacity: 0.1;
                animation: float-minecraft-block 15s linear infinite;
                box-shadow: 0 0 15px rgba(80, 250, 123, 0.3);
            }
            
            @keyframes float-minecraft-block {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(blockContainer);
        
        // Create blocks
        for (let i = 0; i < 15; i++) {
            const block = document.createElement('div');
            const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            const size = Math.random() * 20 + 20;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 10;
            
            block.className = 'minecraft-block';
            block.style.width = `${size}px`;
            block.style.height = `${size}px`;
            block.style.left = `${left}%`;
            block.style.animationDelay = `${delay}s`;
            block.style.animationDuration = `${duration}s`;
            
            // Set block color based on type
            switch(blockType) {
                case 'dirt':
                    block.style.backgroundColor = 'var(--dirt-brown)';
                    break;
                case 'stone':
                    block.style.backgroundColor = 'var(--stone-gray)';
                    break;
                case 'grass':
                    block.style.backgroundColor = 'var(--grass-green)';
                    break;
                case 'diamond':
                    block.style.backgroundColor = 'var(--diamond-blue)';
                    block.style.boxShadow = '0 0 20px var(--diamond-blue)';
                    block.style.opacity = '0.2';
                    break;
            }
            
            blockContainer.appendChild(block);
        }
    }
    
    // Create Minecraft blocks
    createMinecraftBlocks();
    
    // Testimonial slider auto-scroll
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider && testimonialSlider.children.length > 1) {
        let scrollAmount = 0;
        const slideWidth = testimonialSlider.querySelector('.testimonial').offsetWidth + 30; // width + gap
        
        setInterval(() => {
            scrollAmount += slideWidth;
            if (scrollAmount >= testimonialSlider.scrollWidth - testimonialSlider.offsetWidth) {
                scrollAmount = 0;
            }
            testimonialSlider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }, 5000);
    }
    
    // Animated counter for stats (if we add them later)
    function animateCounter(element, target, duration = 2000) {
        if (!element) return;
        
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Animated typing effect for hero heading
    function typeWriter(element, text, speed = 100, delay = 500) {
        if (!element) return;
        
        // Clear any existing text
        element.textContent = '';
        
        // Wait for the specified delay before starting
        setTimeout(() => {
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, speed);
        }, delay);
    }
    
    // Apply typing effect to hero heading
    const heroHeading = document.querySelector('.hero-content h1');
    if (heroHeading) {
        const originalText = heroHeading.textContent;
        typeWriter(heroHeading, originalText, 80);
    }
    
    // Create animated creeper face cursor
    function createCreeperCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'creeper-cursor';
        
        const style = document.createElement('style');
        style.textContent = `
            .creeper-cursor {
                position: fixed;
                width: 30px;
                height: 30px;
                background-color: var(--creeper-green);
                border-radius: 4px;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
                opacity: 0.7;
                box-shadow: 0 0 15px var(--primary-color);
            }
            
            .creeper-cursor:before, .creeper-cursor:after {
                content: '';
                position: absolute;
                background-color: var(--dark-color);
                width: 6px;
                height: 6px;
                top: 8px;
                border-radius: 1px;
            }
            
            .creeper-cursor:before {
                left: 6px;
            }
            
            .creeper-cursor:after {
                right: 6px;
            }
            
            .creeper-cursor .mouth {
                position: absolute;
                width: 12px;
                height: 6px;
                background-color: var(--dark-color);
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 1px;
            }
        `;
        document.head.appendChild(style);
        
        // Add mouth
        const mouth = document.createElement('div');
        mouth.className = 'mouth';
        cursor.appendChild(mouth);
        
        document.body.appendChild(cursor);
        
        // Update cursor position on mouse move
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Scale effect on mouse down
            document.addEventListener('mousedown', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            document.addEventListener('mouseup', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
    
    // Create creeper cursor
    createCreeperCursor();
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < heroSection.offsetHeight) {
                heroImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
                
                // If this is a counter element, animate it
                if (entry.target.classList.contains('counter')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                }
            }
        });
    }, observerOptions);
    
    // Add animation classes and observe elements
    document.querySelectorAll('.feature-card, .plan-card, .testimonial').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .video-transition {
            transition: opacity 1s ease;
            opacity: 0.5;
        }
    `;
    document.head.appendChild(animationStyles);
});
