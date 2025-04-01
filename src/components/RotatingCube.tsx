import React from 'react';

const RotatingCube: React.FC = () => {
  return (
    <div className="w-32 h-32 relative perspective-[800px] mx-auto my-8">
      <div className="w-full h-full absolute transform-style-3d animate-spin-slow">
        {/* Front face */}
        <div className="absolute w-full h-full bg-primary bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-z-[64px]">
          <span className="text-white text-2xl font-bold">+</span>
        </div>
        
        {/* Back face */}
        <div className="absolute w-full h-full bg-secondary bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-z-[-64px] rotate-y-180">
          <span className="text-white text-2xl font-bold">-</span>
        </div>
        
        {/* Right face */}
        <div className="absolute w-full h-full bg-accent bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-x-[64px] rotate-y-90">
          <span className="text-white text-2xl font-bold">×</span>
        </div>
        
        {/* Left face */}
        <div className="absolute w-full h-full bg-primary bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-x-[-64px] rotate-y-[-90deg]">
          <span className="text-white text-2xl font-bold">÷</span>
        </div>
        
        {/* Top face */}
        <div className="absolute w-full h-full bg-secondary bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-y-[-64px] rotate-x-90">
          <span className="text-white text-2xl font-bold">√</span>
        </div>
        
        {/* Bottom face */}
        <div className="absolute w-full h-full bg-accent bg-opacity-70 border-2 border-white flex items-center justify-center transform translate-y-[64px] rotate-x-[-90deg]">
          <span className="text-white text-2xl font-bold">^</span>
        </div>
      </div>
    </div>
  );
};

export default RotatingCube; 