import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { EyeIcon, EyeOffIcon, Moon, Sun, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useToast } from "../ui/use-toast"
import { DarkModeContext } from '../../context/DarkMode'
import heroBG from '../../assets/3.jpg'
import Header from './Header'
import { BarLoader } from 'react-spinners'
import { useMutation } from '@tanstack/react-query'
import GoogleAuthButton from '../sections/GoogleAuthBtn'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const { toast } = useToast()

  const studentForm = useForm()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Student account created successfully.",
      })
      navigate('/login')
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      })
    },
  })

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const onSubmit = (data) => {
    const transformedData = {
     
      name: data.fullname,
      email: data.email,
      password: data.password
    }
    registerMutation.mutate(transformedData)
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header/>
      <main className="flex-grow flex bg-background text-foreground mb-[15px]">
        {/* Left side - same as before */}
        <div style={{ backgroundImage: `url(${heroBG})` }} 
          className="hidden lg:flex lg:w-1/2 bg-background text-foreground flex-col justify-center p-12">
          <h1 className="text-6xl font-bold leading-tight text-white mb-4">
            <span className="text-2xl font-normal block mb-2 text-white">Hi,</span>
            WELCOME<br />TO ENROLL
          </h1>
          <p className="text-xl text-white">
            Join thousands of fellow students and schools looking to further education!
          </p>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 bg-[#f0f6ff] dark:bg-background flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md p-8">
            <h2 className="text-4xl  mb-8">CREATE ACCOUNT↗</h2>

           
                {/* <TabsTrigger value="school">School</TabsTrigger> */}
          
                <form onSubmit={studentForm.handleSubmit(onSubmit)} className="space-y-4">
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      EMAIL
                    </label>
                    <Input id="email" type="email" {...studentForm.register("email", { required: true })} className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium mb-1">
                      FULL NAME
                    </label>
                    <Input id="fullname" type="text" {...studentForm.register("fullname", { required: true })} className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                      PHONE NUMBER
                    </label>
                    <Input id="phoneNumber" type="tel" {...studentForm.register("phoneNumber", { required: true })} className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        {...studentForm.register("password", { required: true })}
                        className="w-full pr-10" 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...studentForm.register("confirmPassword", { 
                          required: true,
                          validate: (val) => val === studentForm.watch('password') || "Passwords do not match"
                        })}
                        className="w-full pr-10" 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button className="w-full mt-6" type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      'SIGN UP'
                    )}
                  </Button>
                 
                </form>
         
            <div className="mt-4 flex items-center justify-between">
              <span className="text-muted-foreground">Already have an account?</span>
              <a href="/login" className="text-primary font-semibold hover:underline">LOG IN↗</a>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-center'>OR</span>
              <GoogleAuthButton/>
            </div>
          </div>
        </div>
      </main>
      <Button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 rounded-full p-2"
        variant="outline"
      >
        {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </div>
  )
}

export default RegisterPage