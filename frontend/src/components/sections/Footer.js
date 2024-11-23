import React, { useContext } from 'react'
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react'
import { DarkModeContext } from '../../context/DarkMode';
import { cn } from "../../lib/utils";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import dark from '../../assets/logo-dark.png'
import light from '../../assets/LOGOs.png'


export default function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer className={cn(
      "relative py-14 px-4 sm:px-6  lg:px-8 transition-colors duration-300",
      darkMode ? "bg-background text-foreground" : "bg-[#F7F9FA] text-gray-800"
    )}>
          {/* <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] absolute",
        )}
      /> */}
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">ENROLL UG</h2>
            <img src={darkMode?dark:light} height={120} width={120} alt="logo" />
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">LINKS</h3>
            <ul className="space-y-2">
              <li><a href="#" className={cn(
                "hover:text-primary transition-colors duration-300",
                darkMode ? "text-muted-foreground" : "text-gray-600"
              )}>Lab</a></li>
              <li><a href="#" className={cn(
                "hover:text-primary transition-colors duration-300",
                darkMode ? "text-muted-foreground" : "text-gray-600"
              )}>About</a></li>
              <li><a href="/contact" className={cn(
                "hover:text-primary transition-colors duration-300",
                darkMode ? "text-muted-foreground" : "text-gray-600"
              )}>Contact us</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">CONTACT</h3>
            <p className={cn(
              "mb-2",
              darkMode ? "text-muted-foreground" : "text-gray-600"
            )}>Kampala, Uganda</p>
            <p className={cn(
              "mb-2",
              darkMode ? "text-muted-foreground" : "text-gray-600"
            )}>+256 751234567</p>
            <p className={darkMode ? "text-muted-foreground" : "text-gray-600"}>
              Email: <a href="mailto:info@enroll.ug.com" className={cn(
                "hover:text-primary transition-colors duration-300",
                darkMode ? "text-primary" : "text-black"
              )}>info@enroll.ug.com</a>
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">SUBSCRIBE</h3>
            <form className="flex gap-2 mb-4">
              <Input 
                type="email" 
                placeholder="EMAIL" 
                className={cn(
                  "flex-grow ",
                  
                )}
              />
              <Button 
              variant="ghost"
               
                className={cn(
                  " py-2 rounded-r-md border border-foreground transition-colors duration-300",
                 
                )}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-[#8377bd]" />
              <span className={cn(
                "text-sm",
                darkMode ? "text-muted-foreground" : "text-gray-600"
              )}>I ACCEPT THE PRIVACY AND COOKIE POLICY</span>
            </label>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className={cn(
                    "transition-colors duration-300",
                    darkMode ? "text-muted-foreground hover:text-primary" : "text-gray-800 hover:text-gray-500"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            <p className="text-sm">&copy; 2024 Enroll Ug</p>
          </div>
        </div>
      </div>
    </footer>
  )
}