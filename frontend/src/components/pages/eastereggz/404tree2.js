

import React, { useState, useEffect, useRef } from 'react'
import p5 from 'p5'

const FractalTreeBackground = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const sketchRef = useRef(null)

  useEffect(() => {
    if (!sketchRef.current) return

    const sketch = (p) => {
      let angle = 0

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
      }

      p.draw = () => {
        p.background(isDarkMode ? 10 : 245, 15)
        p.stroke(isDarkMode ? 255 : 0, isDarkMode ? 50 : 30)
        p.translate(p.width / 2, p.height)
        branch(120)
        angle += 0.01
      }

      function branch(len) {
        p.line(0, 0, 0, -len)
        p.translate(0, -len)
        if (len > 4) {
          p.push()
          p.rotate(angle)
          branch(len * 0.67)
          p.pop()
          p.push()
          p.rotate(-angle)
          branch(len * 0.67)
          p.pop()
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }
    }

    const p5Instance = new p5(sketch, sketchRef.current)

    return () => {
      p5Instance.remove()
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div ref={sketchRef} className="fixed inset-0" />
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 z-10 px-4 py-2 rounded-full ${
          isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
        } transition-colors duration-300`}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default FractalTreeBackground