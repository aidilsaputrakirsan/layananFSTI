/**
 * Layanan Administrasi Prima FSTI
 * Animated Particles Background
 */

class ParticlesBackground {
    constructor(options) {
        this.options = {
            selector: '.particles-bg',
            color: '#2f4dd3',
            density: 50,
            speed: 1,
            connectivity: true,
            connectivityDistance: 150,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.animationFrame = null;
        this.container = null;
        
        this.init();
    }
    
    init() {
        // Find container
        this.container = document.querySelector(this.options.selector);
        if (!this.container) return;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Add event listeners
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // Add pause/resume on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    resizeCanvas() {
        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Set canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    createParticles() {
        // Clear particles array
        this.particles = [];
        
        // Calculate number of particles based on density and canvas size
        const area = this.width * this.height;
        const particleCount = Math.floor(area / 10000 * this.options.density);
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                color: this.options.color,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.updateParticles();
        
        // Request next frame
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(p.color, p.opacity);
            this.ctx.fill();
            
            // Draw connections
            if (this.options.connectivity) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.options.connectivityDistance) {
                        const opacity = 1 - (distance / this.options.connectivityDistance);
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = this.hexToRgba(p.color, opacity * 0.2);
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    hexToRgba(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    pause() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    resume() {
        if (!this.animationFrame) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

/**
 * 3D Floating Elements
 * Creates perspective-based floating elements
 */
class FloatingElements {
    constructor(options) {
        this.options = {
            selector: '.floating-elements',
            count: 10,
            minSize: 20,
            maxSize: 80,
            colors: ['#2f4dd3', '#5a75e6', '#8a9ce9'],
            depth: 200,
            speed: 1,
            shapes: ['circle', 'square', 'triangle'],
            ...options
        };
        
        this.container = null;
        this.elements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.width = 0;
        this.height = 0;
        
        this.init();
    }
    
    init() {
        // Find container
        this.container = document.querySelector(this.options.selector);
        if (!this.container) return;
        
        // Set container style
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        
        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Create elements
        this.createElements();
        
        // Add mouse move event
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Add resize event
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Start animation
        this.animate();
    }
    
    createElements() {
        // Clear existing elements
        this.elements.forEach(el => {
            if (el.element.parentNode) {
                el.element.parentNode.removeChild(el.element);
            }
        });
        this.elements = [];
        
        // Create new elements
        for (let i = 0; i < this.options.count; i++) {
            const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
            const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
            const shape = this.options.shapes[Math.floor(Math.random() * this.options.shapes.length)];
            const depth = Math.random() * this.options.depth;
            const opacity = 0.1 + (depth / this.options.depth) * 0.4;
            const scale = 0.5 + (depth / this.options.depth) * 0.5;
            
            // Create element
            const element = document.createElement('div');
            element.classList.add('floating-element');
            element.style.position = 'absolute';
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.opacity = opacity;
            element.style.transform = `scale(${scale})`;
            element.style.zIndex = Math.floor(depth);
            
            // Set shape styles
            switch (shape) {
                case 'circle':
                    element.style.borderRadius = '50%';
                    element.style.backgroundColor = color;
                    break;
                case 'square':
                    element.style.backgroundColor = color;
                    break;
                case 'triangle':
                    element.style.width = '0';
                    element.style.height = '0';
                    element.style.borderLeft = `${size / 2}px solid transparent`;
                    element.style.borderRight = `${size / 2}px solid transparent`;
                    element.style.borderBottom = `${size}px solid ${color}`;
                    element.style.backgroundColor = 'transparent';
                    break;
            }
            
            // Add to container
            this.container.appendChild(element);
            
            // Add to elements array
            this.elements.push({
                element,
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: depth,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size,
                shape
            });
        }
    }
    
    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleResize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Recreate elements on resize
        this.createElements();
    }
    
    animate() {
        this.updateElements();
        requestAnimationFrame(this.animate.bind(this));
    }
    
    updateElements() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.elements.forEach(el => {
            // Update position
            el.x += el.vx;
            el.y += el.vy;
            
            // Bounce off edges
            if (el.x < 0 || el.x > this.width) el.vx *= -1;
            if (el.y < 0 || el.y > this.height) el.vy *= -1;
            
            // Apply mouse parallax effect
            const parallaxX = (this.mouseX - centerX) / centerX;
            const parallaxY = (this.mouseY - centerY) / centerY;
            const depth = el.z / this.options.depth;
            
            const translateX = el.x + (parallaxX * 20 * depth);
            const translateY = el.y + (parallaxY * 20 * depth);
            
            // Update element style
            el.element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${0.5 + depth * 0.5})`;
        });
    }
    
    destroy() {
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        
        this.elements.forEach(el => {
            if (el.element.parentNode) {
                el.element.parentNode.removeChild(el.element);
            }
        });
    }
}

/**
 * 3D Perspective Cards
 * Creates cards with 3D perspective effect
 */
class PerspectiveCards {
    constructor(options) {
        this.options = {
            selector: '.perspective-card',
            maxTilt: 10,
            ...options
        };
        
        this.cards = [];
        this.init();
    }
    
    init() {
        // Find all cards
        const cardElements = document.querySelectorAll(this.options.selector);
        if (!cardElements.length) return;
        
        // Initialize each card
        cardElements.forEach(card => {
            // Add event listeners
            card.addEventListener('mousemove', this.handleMouseMove.bind(this, card));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this, card));
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this, card));
            
            // Add to cards array
            this.cards.push({
                element: card,
                rect: card.getBoundingClientRect()
            });
            
            // Apply initial perspective
            card.style.transition = 'transform 0.3s ease';
            card.style.transformStyle = 'preserve-3d';
            
            // Add highlight effect
            const highlight = document.createElement('div');
            highlight.classList.add('card-highlight');
            highlight.style.position = 'absolute';
            highlight.style.top = '0';
            highlight.style.left = '0';
            highlight.style.right = '0';
            highlight.style.bottom = '0';
            highlight.style.borderRadius = 'inherit';
            highlight.style.pointerEvents = 'none';
            highlight.style.background = 'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)';
            highlight.style.opacity = '0';
            highlight.style.transition = 'opacity 0.3s ease';
            
            card.appendChild(highlight);
        });
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleMouseMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = ((y - centerY) / centerY) * this.options.maxTilt * -1;
        const tiltY = ((x - centerX) / centerX) * this.options.maxTilt;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        // Update highlight
        const highlight = card.querySelector('.card-highlight');
        if (highlight) {
            highlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)`;
            highlight.style.opacity = '1';
        }
    }
    
    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        
        // Reset highlight
        const highlight = card.querySelector('.card-highlight');
        if (highlight) {
            highlight.style.opacity = '0';
        }
    }
    
    handleMouseEnter(card) {
        // Reset transform on enter to ensure smooth transition
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    
    handleResize() {
        // Update card rects
        this.cards.forEach(card => {
            card.rect = card.element.getBoundingClientRect();
        });
    }
    
    destroy() {
        this.cards.forEach(card => {
            card.element.removeEventListener('mousemove', this.handleMouseMove);
            card.element.removeEventListener('mouseleave', this.handleMouseLeave);
            card.element.removeEventListener('mouseenter', this.handleMouseEnter);
            
            const highlight = card.element.querySelector('.card-highlight');
            if (highlight) {
                card.element.removeChild(highlight);
            }
        });
        
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles background
    const particles = new ParticlesBackground({
        selector: '.particles-bg',
        color: '#2f4dd3',
        density: 50,
        speed: 0.5,
        connectivity: true,
        connectivityDistance: 150
    });
    
    // Initialize floating elements
    const floatingElements = new FloatingElements({
        selector: '.floating-elements',
        count: 15,
        minSize: 10,
        maxSize: 60,
        colors: ['#2f4dd3', '#5a75e6', '#8a9ce9', '#c5cdf4'],
        depth: 200,
        speed: 0.3
    });
    
    // Initialize perspective cards
    const perspectiveCards = new PerspectiveCards({
        selector: '.service-card, .team-card, .feature-card, .prodi-card, .system-card',
        maxTilt: 5
    });
    
    // Store instances in window for potential later use
    window.animations = {
        particles,
        floatingElements,
        perspectiveCards
    };
});