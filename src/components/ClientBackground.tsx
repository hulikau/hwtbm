'use client';

import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

// Dynamically import AnimatedBackground with no SSR
const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground"),
  { ssr: false }
);

export default function ClientBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <>
      {/* Static gradient background that will always show */}
      <div 
        className="fixed top-0 left-0 w-full h-full" 
        style={{ 
          zIndex: -2,
          background: "linear-gradient(120deg, #e0f2fe, #ede9fe, #fce7f3)"
        }}
      />
      
      {/* Either show the animated canvas or static shapes */}
      {isLoaded && <AnimatedBackground />}
    </>
  );
} 