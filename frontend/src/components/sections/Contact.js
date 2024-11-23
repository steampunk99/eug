import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { DarkModeContext } from '../../context/DarkMode'
import { cn } from "../../lib/utils"
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import dark from '../../assets/da.jpg'
import light from '../../assets/li.jpg'
import { Button } from '../ui/button'


export default function Contact() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <section className='h-auto bg-background text-foreground w-full '>
      <p className='text-4xl text-center font-bold '>CONTACT US</p>
      <p className='text-center text-lg mt-10  text-muted-foreground'>
        We're excited to hear from you!
      </p>
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-background")}>
        
      <div className={cn(
        "w-full  max-w-6xl bg-transparent text-foreground flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden backdrop-blur-md",
       
      )}>
        <div 
          className="md:w-1/2 bg-contain rounded-sm p-8 md:p-16 flex flex-col justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${darkMode ? dark : light})`,
           
          }}
    
        >
          <div className='bg-transparent rounded-lg p-5 backdrop-blur-xl'>
          <h1 className="text-4xl md:text-5xl mb-4">Reach out..</h1>
          <p className={cn(
            "mb-6 text-foreground ",
　　 　 　
          )}>
            Whether it's to discuss your next school, any issue you might be facing, or just to say Hi. 
            <br/>  <br/> We're excited to hear from you :)
          </p>

          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            
          >
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
              darkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"
            )}>
              <span className="w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
              Response time is typically 10 minutes.
            </span>
          </motion.div>
          </div>
　 　 　
        </div>
        
        <motion.div 
          className={cn(
            "md:w-1/2 p-8 md:p-16 bg-background border-border border-t border-r border-b",
            
          )}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className={cn(
                "block text-sm font-medium",
                darkMode ? "text-muted-foreground" : "text-gray-700"
              )}>Name</label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Mr Lou" 
                className={cn(
                  "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none",
                 

                )} 
              />
            </div>
            <div>
              <label htmlFor="email" className={cn(
                "block text-sm font-medium",
                darkMode ? "text-muted-foreground" : "text-gray-700"
              )}>Email</label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="lou@gmail.com" 
                className={cn(
                  "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none",
 　 　 　 　 　

                )} 
              />
            </div>
            <div>
              <label htmlFor="subject" className={cn(
                "block text-sm font-medium",
                darkMode ? "text-muted-foreground" : "text-gray-700"
              )}>Subject</label>
              <Input 
                type="text" 
                id="subject" 
                name="subject" 
                placeholder="Subject" 
                className={cn(
                  "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none",
 　 　 　 　 　

                )} 
              />
            </div>
            <div>
              <label htmlFor="message" className={cn(
                "block text-sm font-medium",
                darkMode ? "text-muted-foreground" : "text-gray-700"
              )}>Message</label>
              <Textarea 
                id="message" 
                name="message" 
                rows={4} 
                placeholder="Tell us everything" 
                className={cn(
                  "mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none",
 　 　 　 　 　

                )}
              ></Textarea>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full flex justify-center  py-2 px-4 ",
 　 　 　 　 　

              )}
              whileHover={{ scale: 1.05 }}
          
            >
              Submit
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
    </section>
  )
}