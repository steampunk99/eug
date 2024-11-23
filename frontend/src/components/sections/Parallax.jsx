
import video from "../../assets/clip.mp4";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const Text = () => {
    return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
            <h1 className='text-5xl font-bold text-white'>Parallax</h1>
        </div>
    )
}
export default function Parallax() {
    const container = useRef();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", 'end start']
    })
    const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

    return (
        <div
            ref={container} 
            className='relative flex items-center justify-center h-screen overflow-hidden'
            style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
        >
        <Text />
        <div className='fixed top-[-10vh] left-0 h-[120vh] w-full'>
            <motion.div style={{y}} className='relative w-full h-full'>
                <video src={video} autoPlay muted loop playsInline className='w-full h-full object-cover' />
            </motion.div>
        </div>
        </div>
    )
}