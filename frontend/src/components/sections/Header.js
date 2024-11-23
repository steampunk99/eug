import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Sun, Moon, ChevronDown } from "lucide-react";
import logo from "../../assets/LOGOs.png";
import logod from "../../assets/logo-dark.png";
import { cn } from "../../lib/utils";
import { DarkModeContext } from '../../context/DarkMode'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaSearchengin } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ToastContainer } from 'react-toastify';
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import ShimmerButton from '../ui/shimmer-button';
import { useCompareSchools } from '../../context/CompareContext';
import { authService } from '../../services/authService';

export default function Component() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const { compareSchools } = useCompareSchools();

  const [user, setUser] = useState(null);

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (!window.location.pathname.includes('/search')) {
        const sections = ['home', 'about', 'featured', 'contact', 'faq'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
          }
          return false;
        });
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  const navItems = [
    { name: 'Home', to: '/#home' },
    { name: 'About', to: '/#about' },
  
  
    { name: 'Contact', to: '/#contact' },
    { name: 'FAQ', to: '/#faq' },
    
  ];

  const handleNavigation = (path) => {
    if (window.location.pathname === '/' && path.startsWith('/#')) {
      const sectionId = path.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
    } else {
      navigate(path);
    }
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground uppercase">{user?.username || 'User'}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-background/80 backdrop-blur-lg">
        <DropdownMenuItem className="font-medium text-muted-foreground">
          {user?.role || 'N/A'}
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium text-foreground">
        <DropdownMenuItem >  <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="h-8 w-8 hover:text-foreground flex autoitems-center border border-foreground justify-center bg-transparent text-foreground hover:bg-inherit rounded-full"
                    >
                      {darkMode ? <CiLight />  : <CiDark />}
                    </Button></DropdownMenuItem>
          {user?.role === 'admin' && <a href="/dashboard/admin">Admin Dashboard↗</a>}
          {user?.role === 'student' && <a href="/dashboard/student">Student Dashboard↗</a>}
          {user?.role === 'superadmin' && <a href="/dashboard/superadmin">SuperAdmin Dashboard↗</a>}
          {!user?.role && 'N/A'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed left-0 top-4 right-0 mx-auto z-50 transition-all duration-400 w-11/12 max-w-7xl",
          "bg-background/60 backdrop-blur-xl shadow-lg rounded-md",
          darkMode ? "dark" : ""
        )}
      >
         {/* <BorderBeam className=""/> */}
        <div className="px-6 sm:px-6 py-2">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <img src={darkMode ? logod : logo} alt='Logo' className='h-11 w-auto cursor-pointer' onClick={() => navigate('/')} />
            </motion.div>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      onClick={() => handleNavigation(item.to)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors cursor-pointer hover:text-primary uppercase relative",
                        activeSection === item.to.replace('/#', '') ? "text-primary animate-bounce font-bold" : "text-foreground"
                      )}
                    >
                      {item.name}
                      {activeSection === item.to.replace('/#', '') && (
  <motion.div
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
    layoutId="activeSection"
   
    transition={{
      duration: 0.4,
      type: "spring",
      stiffness: 120,
      damping: 50,
    }}
  />
)}


                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleSearch} className='flex space-x-2'>
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search schools..."
                        className="w-full bg-transparent border-foreground placeholder-foreground"
                      />
                      <Button type="submit" variant="ghost" size="icon">
                        <FaSearchengin className="h-4 w-4" />
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            
              {isAuthenticated ? (
                <div className="hidden md:block">
                  <UserMenu />
                </div>
              ) : (
                <>
                  <ShimmerButton onClick={() => navigate('/search')} className="hidden text-background dark:text-white md:inline-flex">
                    Find Schools↗
                  </ShimmerButton>
                  {/* <Button onClick={() => navigate('/register')} variant="outline" size="sm" className="hidden md:inline-flex rounded-full 
                  bg-transparent border-foreground hover:bg-transparent hover:scale-105 transition ease-linear 
                  font-normal text-foreground hover:border-gray-500 ">
                    Create Account
                  </Button>
                  <Button onClick={() => navigate('/login')} size="sm" className="hidden md:inline-flex rounded-full bg-foreground text-background hover:scale-105 transition ease-linear">
                    Login
                  </Button> */}
                  <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="h-8 w-8 hover:text-foreground flex autoitems-center border border-foreground justify-center bg-transparent text-foreground hover:bg-inherit rounded-full"
                    >
                      {darkMode ? <CiLight /> : <CiDark />}
                    </Button>
                </>
              )}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/compare')}
                className="relative"
              >
                Compare
                {compareSchools.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {compareSchools.length}
                  </span>
                )}
              </Button> */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  position="right"
                  size="content"
                  className="bg-background/70 backdrop-blur-lg py-6 px-6 rounded-lg shadow-lg"
                >
                  <NavigationMenu>
                    <NavigationMenuList>
                      {navItems.map((item) => (
                        <NavigationMenuItem key={item.name}>
                          <NavigationMenuLink
                            onClick={() => handleNavigation(item.to)}
                            className={cn(
                              "block px-4 py-2 text-sm font-medium transition-colors cursor-pointer hover:text-primary uppercase relative",
                              activeSection === item.to.replace('/#', '') ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {item.name}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                  <div className="mt-8">
                    {isAuthenticated ? <UserMenu /> : (
                      <div className="space-y-2">
                        <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                          Login
                        </Button>
                        <Button onClick={() => navigate('/register')} variant="default" className="w-full">
                          Create Account
                        </Button>
                        
                      </div>
                    )}
                    <button
                     
                      onClick={toggleDarkMode}
                      className="ring-neutral-700 bg-transparent flex items-center justify-center mx-auto"
                    >
                      {darkMode ? <Sun /> : <Moon />}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
       
      </motion.header>
      <ToastContainer />
    </>
  );
}
