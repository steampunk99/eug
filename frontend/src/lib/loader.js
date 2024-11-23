"use client"

import React, { useState, useEffect,useContext, useRef } from 'react'
import { gsap } from 'gsap'
import logo from "../assets/LOGOs.png"
import logod from "../assets/logo-dark.png"
import { DarkModeContext } from '../context/DarkMode'
import { cn } from "../lib/utils";

export default function Loader() {
  const [loading, setLoading] = useState(true)
  const loaderRef = useRef(null)
  const textRef = useRef(null)
  const { darkMode } = useContext(DarkModeContext);


  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setLoading(false), 1500) // Delay hiding the loader
      }
    })

    tl.to(textRef.current, {
      duration: 2,
      opacity: 1,
      scale: 1.1,
      
      ease: 'power2.out'
    })
    .to(textRef.current, {
      duration: 1,
      scale: 1.1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1
    })
    .to(loaderRef.current, {
      duration: 1.5,
      yPercent: -100,
      ease: 'power4.inOut'
    }, '+=0.5')

    return () => tl.kill()
  }, [])

  

  return (
    <div className={`relative min-h-screen overflow-hidden bg-background text-background-foreground`}>
      {loading && (
        <div
          ref={loaderRef}
          className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background text-background-foreground")}
          aria-label="Loading"
        >
          <img ref={textRef} alt='logo' src={darkMode?logod:logo}
            className={cn("loader-text text-6xl md:text-8xl font-bold opacity-0 transform translate-y-10 bg-background text-background-foreground",
             
            )} />
          <div 
            
          >
           
          </div>
        </div>
      )}
    </div>
  )
}