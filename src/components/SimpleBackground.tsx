'use client';

import React, { useState, useEffect } from 'react';

const SimpleBackground: React.FC = () => {
  // Create state for shapes that will only be populated on the client
  const [shapes, setShapes] = useState<Array<any>>([]);
  
  // Generate shapes only on the client side to avoid hydration mismatch
  useEffect(() => {
    const generatedShapes = Array.from({ length: 150 }, (_, i) => {
      // Randomize properties
      const size = Math.floor(Math.random() * 12) + 8; // 8-20px size
      const x = Math.floor(Math.random() * 100); // Position as percentage
      const y = Math.floor(Math.random() * 100); 
      const type = Math.floor(Math.random() * 2); // 0: circle, 1: rect (removed triangles)
      
      // Use direct color values
      const colors = [
        '#93c5fd', '#f9a8d4', '#fcd34d', '#86efac', 
        '#c4b5fd', '#a5b4fc', '#fca5a5', '#a5f3fc'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const delay = Math.floor(Math.random() * 5); // Animation delay
      const duration = Math.floor(Math.random() * 3) + 5; // 5-8s duration
      const rotate = Math.floor(Math.random() * 45) - 22; // Random rotation
      
      return { size, x, y, type, color, delay, duration, rotate };
    });
    
    setShapes(generatedShapes);
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: "linear-gradient(120deg, #e0f2fe, #ede9fe, #fce7f3)",
          zIndex: -10
        }}
      />
      
      {/* SVG container - only render shapes on client side */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -5 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {shapes.length > 0 && (
          <>
            {shapes.map((shape, index) => {
              if (shape.type === 0) {
                // Circle
                return (
                  <circle
                    key={index}
                    cx={`${shape.x}%`}
                    cy={`${shape.y}%`}
                    r={shape.size / 2}
                    fill={shape.color}
                    opacity="0.8"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; ${20 + index % 10},${10 + index % 5}; ${10 + index % 5},${20 + index % 10}; ${-10 - index % 5},${10 + index % 5}; 0,0`}
                      dur={`${shape.duration}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${shape.x} ${shape.y}; ${shape.rotate} ${shape.x} ${shape.y}; ${-shape.rotate} ${shape.x} ${shape.y}; 0 ${shape.x} ${shape.y}`}
                      dur={`${shape.duration + 2}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </circle>
                );
              } else {
                // Rectangle
                return (
                  <rect
                    key={index}
                    x={`${shape.x}%`}
                    y={`${shape.y}%`}
                    width={shape.size}
                    height={shape.size}
                    rx="2"
                    fill={shape.color}
                    opacity="0.8"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; ${20 + index % 10},${10 + index % 5}; ${10 + index % 5},${20 + index % 10}; ${-10 - index % 5},${10 + index % 5}; 0,0`}
                      dur={`${shape.duration}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${shape.x} ${shape.y}; ${shape.rotate} ${shape.x} ${shape.y}; ${-shape.rotate} ${shape.x} ${shape.y}; 0 ${shape.x} ${shape.y}`}
                      dur={`${shape.duration + 3}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </rect>
                );
              }
            })}
          </>
        )}
      </svg>
    </div>
  );
};

export default SimpleBackground; 