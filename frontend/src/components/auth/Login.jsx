import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Login = () => {
    const [input,setInput] =useState({
        email:"",
        password:"",
        role:"",
    });
    const changeEventHandler = (e)=>{
        setInput({...input, [e.target.name]:e.target.value});
    }
    const submitHandler = async(e) =>{
            e.preventDefault();
            console.log(input);
    }
    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
            <Navbar />

            <div className='flex items-center justify-center px-4'>
                <form onSubmit={submitHandler} className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12 border border-gray-100'>

                    <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
                        Welcome Back 👋
                    </h1>
                    {/* Email */}
                    <div className='mb-4'>
                        <Label className="text-gray-700">Email</Label>
                        <Input
                            type='email'
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    {/* Password */}
                    <div className='mb-4'>
                        <Label className="text-gray-700">Password</Label>
                        <Input
                            type='password'
                             value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your Password"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Role Selection */}
                    <div className='mb-4'>
                        <Label className="text-gray-700 block mb-2">Select Role</Label>
                        <div className="flex space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                type="radio"
                                 name="role" 
                                 value="student"
                                 checked={input.role = 'student'}
                                 onChange={changeEventHandler}
                                 />
                                Student
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                type="radio"
                                 name="role"
                                  value="recruiter"
                                  checked={input.role = 'recruiter'}
                                 onChange={changeEventHandler}
                                  />
                                Recruiter
                            </label>
                        </div>
                    </div>
                    {/* Button */}
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
                    >
                        Login
                    </Button>
                    <span className="text-center text-sm text-gray-700 mt-4">
                                            Don't have an account?{" "}<Link to="/signup"
                                                className="text-purple-700 font-semibold cursor-pointer hover:underline">
                                                Signup
                                            </Link>
                                        </span>

                </form>
            </div>
        </div>
    )
}

export default Login
