import React from 'react';

const RotatingCube: React.FC = () => {
  return (
    <div className="w-36 h-36 relative perspective-[800px] mx-auto my-8">
      <div className="w-full h-full absolute transform-style-3d animate-spin-slow" style={{transformStyle: 'preserve-3d'}}>
        {/* Front face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-z-[72px]" style={{animation: 'colorCycle 8s infinite'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">+</span>
        </div>
        
        {/* Back face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-z-[-72px] rotate-y-180" style={{animation: 'colorCycle 8s infinite 1s'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">-</span>
        </div>
        
        {/* Right face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-x-[72px] rotate-y-90" style={{animation: 'colorCycle 8s infinite 2s'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">×</span>
        </div>
        
        {/* Left face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-x-[-72px] rotate-y-[-90deg]" style={{animation: 'colorCycle 8s infinite 3s'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">÷</span>
        </div>
        
        {/* Top face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-y-[-72px] rotate-x-90" style={{animation: 'colorCycle 8s infinite 4s'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">√</span>
        </div>
        
        {/* Bottom face */}
        <div className="absolute w-full h-full color-cycle border-2 border-white flex items-center justify-center transform translate-y-[72px] rotate-x-[-90deg]" style={{animation: 'colorCycle 8s infinite 5s'}}>
          <span className="text-white text-3xl font-bold drop-shadow-lg">^</span>
        </div>
      </div>
    </div>
  );
};

export default RotatingCube; 