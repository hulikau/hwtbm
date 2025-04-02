'use client';

import React, { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  type: 'circle' | 'square';
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Create shapes
    const shapes: Shape[] = [];
    const colors = ['#5B7DB1', '#F75D7E', '#FFCE6A', '#4285F4', '#EA4335', '#FBBC05', '#34A853'];
    const numShapes = Math.min(300, Math.floor(window.innerWidth * window.innerHeight / 5000));
    
    for (let i = 0; i < numShapes; i++) {
      const size = Math.random() * 60 + 60; // Much larger shapes
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        type: ['circle', 'square'][Math.floor(Math.random() * 2)] as 'circle' | 'square'
      });
    }
    
    // Draw a shape based on its type
    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      switch(shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
          
        case 'square':
          ctx.beginPath();
          ctx.rect(
            shape.x - shape.size / 2,
            shape.y - shape.size / 2,
            shape.size,
            shape.size
          );
          ctx.fill();
          ctx.stroke();
          break;
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw shapes
      shapes.forEach(shape => {
        // Move shape
        shape.x += shape.vx;
        shape.y += shape.vy;
        
        // Bounce off edges
        if (shape.x < shape.size / 2 || shape.x > canvas.width - shape.size / 2) {
          shape.vx *= -1;
          shape.x = Math.max(shape.size / 2, Math.min(canvas.width - shape.size / 2, shape.x));
        }
        
        if (shape.y < shape.size / 2 || shape.y > canvas.height - shape.size / 2) {
          shape.vy *= -1;
          shape.y = Math.max(shape.size / 2, Math.min(canvas.height - shape.size / 2, shape.y));
        }
        
        // Simple collision detection with other shapes
        shapes.forEach(otherShape => {
          if (shape === otherShape) return;
          
          const dx = shape.x - otherShape.x;
          const dy = shape.y - otherShape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = shape.size / 2 + otherShape.size / 2;
          
          if (distance < minDistance) {
            // Collision response
            const angle = Math.atan2(dy, dx);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            // Move shapes apart
            const tx = (shape.x + otherShape.x) / 2;
            const ty = (shape.y + otherShape.y) / 2;
            
            shape.x = tx + cos * minDistance / 2;
            shape.y = ty + sin * minDistance / 2;
            otherShape.x = tx - cos * minDistance / 2;
            otherShape.y = ty - sin * minDistance / 2;
            
            // Exchange velocities
            const vx1 = shape.vx * 0.9;
            const vy1 = shape.vy * 0.9;
            
            shape.vx = otherShape.vx * 0.9;
            shape.vy = otherShape.vy * 0.9;
            otherShape.vx = vx1;
            otherShape.vy = vy1;
          }
        });
        
        // Draw the shape
        drawShape(ctx, shape);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-1 opacity-80"
      style={{ zIndex: -1 }}
    />
  );
};

export default AnimatedBackground; 