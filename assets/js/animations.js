/**
 * Layanan Administrasi Prima FSTI
 * Custom Animations
 */

/**
 * Initialize all animations
 */
function initAnimations() {
    // Animate elements on scroll
    setupScrollAnimations();
    
    // Animate counters
    setupCounters();
    
    // Animate hero section
    animateHero();
    
    // Animate service cards on hover
    setupServiceCardAnimations();
    
    // Animate navigation links
    setupNavAnimations();
}

/**
 * Setup scroll-based animations
 */
function setupScrollAnimations() {
    // Elements to animate
    const animElements = document.querySelectorAll('.anim-element');
    
    // Set initial state
    animElements.forEach(element => {
        element.style.opacity = '0';
        
        // Set animation type based on data attribute
        const animType = element.dataset.animType || 'fade-up';
        const animDelay = element.dataset.animDelay || '0';
        
        element.style.transitionDelay = `${animDelay}ms`;
        
        switch (animType) {
            case 'fade-up':
                element.style.transform = 'translateY(20px)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(-20px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(20px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(-20px)';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.9)';
                break;
            case 'zoom-out':
                element.style.transform = 'scale(1.1)';
                break;
        }
    });
    
    // Function to check if element is in viewport
    function checkInView() {
        animElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const inView = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
            
            if (inView) {
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0) scale(1)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }
    
    // Check on scroll and initial load
    window.addEventListener('scroll', checkInView);
    window.addEventListener('load', checkInView);
    window.addEventListener('resize', checkInView);
    
    // Initial check
    checkInView();
}

/**
 * Animate number counters
 */
function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        counter.innerText = '0';
        
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            
            const increment = target / 200;
            
            if (count < target) {
                counter.innerText = `${Math.ceil(count + increment)}`;
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start counter when in view
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

/**
 * Animate hero section
 */
function animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroTitle) heroTitle.classList.add('animate__animated', 'animate__fadeInUp');
    if (heroSubtitle) {
        heroSubtitle.classList.add('animate__animated', 'animate__fadeInUp');
        heroSubtitle.style.animationDelay = '0.2s';
    }
    if (heroButtons) {
        heroButtons.classList.add('animate__animated', 'animate__fadeInUp');
        heroButtons.style.animationDelay = '0.4s';
    }
    if (heroImage) {
        heroImage.classList.add('animate__animated', 'animate__fadeInRight');
        heroImage.style.animationDelay = '0.6s';
    }
}

/**
 * Setup service card animations
 */
function setupServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card, .system-card, .prodi-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(47, 77, 211, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

/**
 * Setup navigation animations
 */
function setupNavAnimations() {
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
    
    // Animate navbar brand
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.addEventListener('mouseenter', () => {
            navbarBrand.style.transform = 'scale(1.05)';
        });
        
        navbarBrand.addEventListener('mouseleave', () => {
            navbarBrand.style.transform = 'scale(1)';
        });
    }
}

/**
 * Animate page transitions
 * @param {string} from - The ID of the section to animate out
 * @param {string} to - The ID of the section to animate in
 */
function animatePageTransition(from, to) {
    const fromSection = document.getElementById(from);
    const toSection = document.getElementById(to);
    
    if (!fromSection || !toSection) return;
    
    // Animate out
    fromSection.style.opacity = '0';
    fromSection.style.transform = 'translateY(-20px)';
    fromSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // After animation out is complete, hide the section and show the new one
    setTimeout(() => {
        fromSection.classList.remove('active');
        toSection.classList.add('active');
        
        // Reset styles for the section that was animated out
        fromSection.style.opacity = '';
        fromSection.style.transform = '';
        
        // Animate in
        toSection.style.opacity = '0';
        toSection.style.transform = 'translateY(20px)';
        
        // Force reflow
        void toSection.offsetWidth;
        
        toSection.style.opacity = '1';
        toSection.style.transform = 'translateY(0)';
        toSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 300);
}

/**
 * Animate elements in a sequence
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animation - Animation class to add
 * @param {number} delay - Delay between animations in ms
 */
function animateSequence(selector, animation, delay = 100) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate__animated', animation);
        }, index * delay);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initAnimations);