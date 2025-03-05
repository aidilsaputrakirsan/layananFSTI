/**
 * Simple Particles Background
 * Lightweight background animation for FSTI website
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get all particle containers
    const containers = document.querySelectorAll('.particles-bg');
    
    // Initialize particles in each container
    containers.forEach(container => {
      initParticles(container);
    });
  });
  
  /**
   * Initialize particles in container
   */
  function initParticles(container) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    
    // Set canvas size
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Particle settings - reduced counts for performance
    const particleCount = Math.min(Math.floor((width * height) / 20000), 50);
    const particleColor = '#2f4dd3';
    const lineColor = 'rgba(47, 77, 211, 0.15)';
    const maxDistance = 150;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1
      });
    }
    
    // Animation loop
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        
        // Connect particles with lines (with distance limit for performance)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
          }
        }
      }
      
      // Only continue animation if tab is visible
      if (!document.hidden) {
        requestAnimationFrame(animate);
      }
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
      // Debounce resize
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(function() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
      }, 200);
    });
    
    // Start animation
    animate();
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        animate();
      }
    });
  }