import React, { useState, useEffect, useRef } from 'react'
import p5 from 'p5'

const DynamicBackground = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const sketchRef = useRef(null)

  useEffect(() => {
    if (!sketchRef.current) return

    const sketch = (p) => {
      let t = 0
      const points = []
      const pointCount = 200

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        for (let i = 0; i < pointCount; i++) {
          points.push({
            x: p.random(p.width),
            y: p.random(p.height),
            angle: p.random(p.TWO_PI)
          })
        }
      }

      const a = (x, y, d) => {
        const k = x / 8 - 25
        const e = y / 8 - 25
        const q = x / 3 + k * 0.5 / p.cos(y * 5) * p.sin(d * d - t)
        const c = d / 2 - t / 8
        return [
          q * p.sin(c) + e * p.sin(d + k - t) + p.width / 2,
          (q + y / 8 + d * 9) * p.cos(c) + p.height / 2
        ]
      }

      p.draw = () => {
        p.background(isDarkMode ? 20 : 240, 10)
        p.stroke(isDarkMode ? 255 : 0, isDarkMode ? 96 : 64)
        p.strokeWeight(isDarkMode ? 1 : 0.5)

        for (let i = 0; i < points.length; i++) {
          const point = points[i]
          const d = p.mag(point.x / 8 - 25, point.y / 8 - 25) ** 2 / 99
          const [x, y] = a(point.x, point.y, d)

          p.point(x, y)

          point.x += p.cos(point.angle) * 0.5
          point.y += p.sin(point.angle) * 0.5
          point.angle += p.random(-0.05, 0.05)

          if (point.x < 0 || point.x > p.width) point.x = p.random(p.width)
          if (point.y < 0 || point.y > p.height) point.y = p.random(p.height)

          for (let j = i + 1; j < points.length; j++) {
            const other = points[j]
            const d = p.dist(x, y, other.x, other.y)
            if (d < 50) {
              p.stroke(isDarkMode ? 255 : 0, p.map(d, 0, 50, isDarkMode ? 96 : 64, 0))
              p.line(x, y, other.x, other.y)
            }
          }
        }

        t += p.PI / 120
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

export default DynamicBackground