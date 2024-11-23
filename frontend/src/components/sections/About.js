import React, { useRef, useEffect, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { CheckCircle, Ellipsis } from "lucide-react";
import { DarkModeContext } from "../../context/DarkMode";
import { cn } from "../../lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import GlowingCard from "../ui/glowing-card";
// import GridPattern from "../components/ui/animated-grid-pattern";
import video from "../../assets/clip.mp4";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Explore Schools",
    description: "Find schools matching your criteria",
    icon: ""
  },
  {
    title: "Compare Options",
    description: "Make informed decisions with side-by-side comparisons",
    icon: ""
  },
  {
    title: "Create Your Profile",
    description: "Tell us about your academic interests and goals",
    icon: ""
  },
  {
    title: "Apply with Ease",
    description: "Submit applications through our streamlined process",
    icon: ""
  }
];

const features = [
  "Comprehensive school database",
  "Personalized recommendations",
  "Application tracking",
  "Deadline reminders",
  "Expert advice"
];


export default function Component() {
  const { darkMode } = useContext(DarkModeContext);
  const stepsRef = useRef(null);
  const featuresRef = useRef(null);
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    gsap.fromTo(stepsRef.current.children, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.2, 
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(featuresRef.current.children, 
      { x: -50, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        stagger: 0.1, 
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        }
      }
    );
    gsap.fromTo(titleRef.current.children, 
      { y: -50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.2, 
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        }
      }
    );

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 100;
      if (scrollY > threshold) {
        controls.start({ opacity: 0, y: 20 });
      } else {
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <section className={cn(
      "w-full h-auto py-2 bg-background text-foreground transition-colors duration-300 relative overflow-hidden",
    )}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-1/3 h-[500px] bg-primary/10 
          transform -translate-x-10 -translate-y-10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
          }}
        />
        <div className="absolute top-1/3 right-0 w-1/2 h-[400px] bg-secondary/10 
          transform translate-x-20"
          style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
        <div className="absolute bottom-0 left-1/4 w-1/3 h-[300px] bg-accent/10 
          transform -translate-y-10"
          style={{
            clipPath: "circle(50% at 50% 100%)",
          }}
        />
      </div>

      <div ref={titleRef} className="container mx-auto px-4 sm:px-6 py-8 lg:px-8">
        <div className="relative">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center mb-4 relative z-10"
          >
            How Enroll Works
          </motion.h2>
          <div className="absolute inset-0 bg-primary/5 -z-10"
            style={{
              clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-16 max-w-3xl mx-auto"
        >
          Simplifying your journey to finding and applying to your dream school
        </motion.p>

        
        <div ref={scrollRef} className="">
          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {steps.map((step, index) => (
              <GlowingCard width={256} height={160}>
              <motion.div
                key={index}
                
                className={cn(
                  "overflow-hidden p-2 justify-center items-center rounded-2xl  h-full w-full transition-all duration-300",
                  
                )}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl justify-center items-center text-center font-semibold mb-2" >{step.title}</h3>
                <p className={cn(
                  "text-sm justify-center items-center text-center",
                  darkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  {step.description}
                </p>
              </motion.div>
              </GlowingCard>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >

             <video src={video} autoPlay loop muted playsInline className="w-full rounded-full h-full object-cover" />

              
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h3 className="text-5xl font-bold mb-6">Your Trusted Partner in Education</h3>
              <p className={cn(
                "text-lg mb-6",
                darkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Enroll-UG is your gateway to educational opportunities. We simplify the journey of finding and applying to schools that align with your academic goals and personal aspirations.
              </p>
              <ul ref={featuresRef} className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    whileHover={{ scale: 1.05, originX: 0 }}
                  >
                    <Ellipsis className="mr-2 text-green-500" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          </div>
         

            
      </div>
    </section>
  );
}