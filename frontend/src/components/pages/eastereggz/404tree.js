'use client';

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

export default function FractalTree404() {
  // Use a ref to attach the p5 sketch to a div element in the DOM
  const sketchRef = useRef(null);

  // Use the effect hook to initialize the p5 sketch
  useEffect(() => {
    // Check if the ref is set; return early if it isn't
    if (!sketchRef.current) return;

    // Define the p5 sketch
    const sketch = (p) => {
      let angle = 0; // Angle for rotating branches of the fractal tree
      let maxDepth = 9; // Maximum depth of recursion for tree branches

      // Recursive function to draw the fractal tree
      const drawTree = (x, y, len, depth) => {
        // Exit the function if the maximum recursion depth is reached
        if (depth > maxDepth) return;

        // Save the current drawing state
        p.push();
        // Translate to the (x, y) position to start drawing the branch
        p.translate(x, y);

        // Set stroke color and weight based on depth
        p.stroke(255, 100 + depth * 20);
        p.strokeWeight(depth * 0.5);

        // Draw a line for the current branch
        p.line(0, 0, 0, -len);
        // Move the starting point to the end of the current branch
        p.translate(0, -len);

        // Calculate the new length for the next branch
        const newLen = len * 0.67;

        // Draw the right branch with rotation
        p.push();
        p.rotate(angle);
        drawTree(0, 0, newLen, depth + 1);
        p.pop();

        // Draw the left branch with rotation in the opposite direction
        p.push();
        p.rotate(-angle);
        drawTree(0, 0, newLen, depth + 1);
        p.pop();

        // Restore the drawing state
        p.pop();
      };

      // p5 setup function, called once when the sketch starts
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight); // Create a canvas that fills the window
        p.background(0); // Set background color to black
      };

      // p5 draw function, called continuously to update the canvas
      p.draw = () => {
        p.background(0, 10); // Apply a fading effect for the background
        // Map the mouse's X position to adjust the angle of branches
        angle = p.map(p.mouseX, 0, p.width, 0, p.PI / 4);
        // Map the mouse's Y position to adjust the depth of the fractal tree
        maxDepth = p.map(p.mouseY, 0, p.height, 5, 12);
        // Draw the fractal tree starting from the bottom center of the canvas
        drawTree(p.width / 2, p.height, p.height / 4, 0);
      };

      // Resize the canvas if the window size changes
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    // Create a new p5 instance with the sketch and attach it to the ref's DOM node
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup function to remove the p5 instance when the component unmounts
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    // Wrapper div to hold the canvas, covering the entire screen
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <div ref={sketchRef} className="w-full h-full" />
    </div>
  );
}
