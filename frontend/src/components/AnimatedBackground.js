import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: themeColors.primary
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = themeColors.primary + Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [themeColors.primary]);

  return (
    <div className="animated-background">
      <canvas
        ref={canvasRef}
        className="particles-canvas"
        style={{ opacity: 0.3 }}
      />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="floating-shape shape-1"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.secondary})`,
          opacity: 0.1
        }}
      />
      
      <motion.div
        className="floating-shape shape-2"
        animate={{
          y: [0, 30, 0],
          rotate: [360, 180, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          background: `linear-gradient(45deg, ${themeColors.accent}, ${themeColors.primary})`,
          opacity: 0.08
        }}
      />
      
      <motion.div
        className="floating-shape shape-3"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -180, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{
          background: `linear-gradient(45deg, ${themeColors.secondary}, ${themeColors.accent})`,
          opacity: 0.06
        }}
      />
    </div>
  );
};

export default AnimatedBackground;

