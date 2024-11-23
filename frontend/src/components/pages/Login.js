import React, { useState,useContext } from 'react';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Header from './Header';
import { DarkModeContext } from '../../context/DarkMode';
import heroBG from '../../assets/3.jpg'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

import { Loader2, LockIcon } from 'lucide-react';
import GoogleAuthButton from '../sections/GoogleAuthBtn';
import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
const {toast} = useToast()
const {login,user,loading} = useAuth();


//handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

//handle submit and login
  const handleSubmit = async (e) => {
    e.preventDefault();
      login(formData);
     console.log(user);   
      }
  

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      
      <Header/>
     
      <main className="flex flex-grow bg-background text-foreground">
        {/* Left side */}
        <div style={{ backgroundImage: `url(${heroBG})` }} className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-background text-white">
          <h1 className="text-6xl font-bold leading-tight mb-4">
            <span className="text-2xl font-normal block mb-2">Hi,</span>
            WELCOME<br />BACK
          </h1>
          <p className="text-xl">Your journey to higher education awaits!</p>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 bg-[#f0f6ff] dark:bg-background flex items-center justify-center">
          <div className="w-full max-w-md p-8 flex flex-col justify-center h-[550px]">

            <div className='flex  gap-2 items-center text-center justify-center w-full h-auto'>
              <h2 className="text-4xl  mb-2">LOGIN </h2><LockIcon className='w-7 h-7 mb-2'/>
              </div>

            <p className="text-xl text-primary  mb-12">Sign back in to your account to access your profile.</p>
            <form className="space-y-6 flex-grow flex flex-col justify-center" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  EMAIL
                </label>
                <Input id="email" type="email" placeholder='Enter your email'  value={formData.email} onChange={handleInputChange} className="w-full" required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  PASSWORD
                </label>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full" required />
              </div>
              <div className="flex justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button className="w-full">
                {loading ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" /></> : 'LOG IN'}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Create Account
                </Link>
              </div>
              {/* add or text */}
              <span className='text-center'>OR</span>
              <div className='flex flex-col gap-2'>
              <GoogleAuthButton/>
           
              </div>
             
            </form>
          </div>
        </div>
      </main>

    
    </div>
  );
}