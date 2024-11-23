"use client";

import React, { useRef, useEffect } from "react";
import p5 from "p5";

// Component that creates an animated jellyfish using p5.js
const JellyFish = () => {
  // Reference to hold the DOM element where p5 sketch will be mounted
  const sketchRef = useRef(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    // Main p5.js sketch definition
    const sketch = (p) => {
      // Time variable for animation
      let t = 0;
      
      // Get window dimensions
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Helper function to calculate magnitude (distance from origin)
      const mag = (x, y) => Math.sqrt(x * x + y * y);

      // Adjust these constants to modify the jellyfish's appearance
      const JELLY_WIDTH = 650;    // Increased from 550 for wider jellyfish
      const JELLY_HEIGHT = 250;   // Increased from 200 for longer tentacles
      const POINT_DENSITY = 4;    // Decreased from 8 for more detailed tentacles
      const TRANSPARENCY = 128;   // Increased from 92 for more visible points
      
      // Mathematical function that generates jellyfish-like movement
      // Parameters:
      // x, y: coordinates in space
      // d: calculated distance value (default uses magnitude formula)
      const a = (x, y, d = mag(x / 8 - 25, y / 9.8 - 25) ** 2 / 99) => {
        const k = x / 8 - 25;  // Normalized x coordinate
        const e = y / 8 - 25;  // Normalized y coordinate
        
        // Added additional sine waves for more undulating movement
        const q = x / 3 + (k * 0.55) / Math.cos(y * 4) * Math.sin(d * d - t) 
                  + Math.sin(t * 0.5 + y / 50) * 15; // Added subtle side-to-side movement
        
        const c = d / 2 - t / 8;
        
        return [
          q * Math.sin(c) + e * Math.sin(d + k - t) + w/2,  // Centered horizontally
          (q + y / 7 + d * 8) * Math.cos(c) + h/3,         // Positioned higher vertically
        ];
      };

      // Initial setup of canvas
      p.setup = () => {
        p.createCanvas(w, h);
      };

      // Animation loop
      p.draw = () => {
        // Set dark background
        p.background(6);
        // Set white color with transparency for points
        p.stroke(255, TRANSPARENCY);
        
        // Added slight pulse to stroke weight for more organic feel
        const pulsingWeight = 1 + Math.sin(t) * 0.5;
        p.strokeWeight(pulsingWeight);
        
        // Updated grid parameters
        for (let y = 99; y < JELLY_HEIGHT; y += POINT_DENSITY) {
          for (let x = 99; x < JELLY_WIDTH; x++) {
            // Calculate new position for each point using the transformation function
            const [px, py] = a(x, y);
            p.point(px, py);
          }
        }
        // Slowed down the animation slightly
        t += Math.PI / 80;
      };

      // Fixed window resize handler
      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    // Create new p5 instance and attach it to the DOM
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup function to remove p5 instance when component unmounts
    return () => {
      p5Instance.remove();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    // Container with full viewport height and dark background
    <div className="relative w-full h-screen overflow-hidden  bg-[#111]">
      {/* Canvas container with border and rounded corners */}
      <div ref={sketchRef} className="border border-[#333] rounded-lg overflow-hidden shadow-lg" />
    </div>
  );
};

export default JellyFish;
