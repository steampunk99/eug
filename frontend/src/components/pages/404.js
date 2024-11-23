
import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { HomeIcon, ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Error404() {
  const sketchRef = useRef(null)

  useEffect(() => {
    if (!sketchRef.current) return

    const sketch = (p) => {
      let t = 0
      const w = window.innerWidth
      const h = window.innerHeight

      const a = (x, y, d = p.mag(x / 8 - 25, y / 8 - 25) ** 2 / 99) => {
        const k = x / 8 - 25
        const e = y / 8 - 25
        const q = x / 3 + (k * 0.5) / p.cos(y * 5) * p.sin(d * d - t)
        const c = d / 2 - t / 8
        return [
          q * p.sin(c) + e * p.sin(d + k - t) + w / 2,
          (q + y / 8 + d * 9) * p.cos(c) + h / 2
        ]
      }

      p.setup = () => {
        p.createCanvas(w, h)
      }

      p.draw = () => {
        p.background(6, 20) // Reduced opacity for trailing effect
        p.stroke(255, 64)
        t += p.PI / 120 // Slowed down animation

        for (let y = 0; y < h; y += 10) {
          for (let x = 0; x < w; x += 10) {
            const [px, py] = a(x, y)
            p.point(px, py)
          }
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
      }
    }

    const p5Instance = new p5(sketch, sketchRef.current)

    return () => {
      p5Instance.remove()
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={sketchRef} className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 ">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">404</h1>
          <p className="text-xl text-gray-200 mb-6 text-center">Oops! Seems you wondered too far..</p>
  
          <div className="flex justify-center space-x-4">
            <Link to="/">
            <Button  className="">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Button>
            </Link>
            <Link to="/search">
            <Button  className="">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Search Schools
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}