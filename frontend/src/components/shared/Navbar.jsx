import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, User2 } from 'lucide-react';

const Navbar = () => { 
    const user = false;
    return (
        <div className="w-full bg-white">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

                <h1 className="text-5xl font-bold">
                    Career<span className="text-blue-400">Yatra</span>
                </h1>
                <div className='flex items-center space-x-5'>
                    <ul className="flex items-center space-x-5 font-medium list-none p-0 m-0">
                        <li className='cursor-pointer'><Link to="/">Home</Link></li>
                         <li className='cursor-pointer'><Link to="/jobs">Jobs</Link></li>
                          <li className='cursor-pointer'><Link to="/browse">Browse</Link></li>
                        
                    </ul>
                {!user ?(
                        <div className='flex  items-center gap-2 space-x-2'>
                            <Link to="/login"><Button varient="outline">Login</Button></Link>
                            <Link to="/signup"> <Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Signup</Button></Link> 
                        </div>
                    ):(
<Popover classname="cursor-pointer">
                        <PopoverTrigger asChild>
                            <Avatar className=' w-7 h-7 rounded-full overflow-hidden cursor-pointer '>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className='w-full h-full object-cover' />

                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6 border-0 outline-none shadow-lg">
                            <div className="flex gap-6 space-y-1 space-x-2 ">
                                <Avatar className="w-7 h-7 rounded-full overflow-hidden">
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </Avatar>

                                <div>
                                    <h4 className="font-medium">NIKITA RAJ </h4>
                                    <p className='text-sm text-muted-foreground'> Lorem ipsum dolor sit amet.</p>
                                </div>
                            </div>
                            <div className='flex flex-col text-gray-60'>
                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                    <User2/>
                                        <Button varient="link"> <Link to="/profile">View Profile</Link> </Button>
                                    
                                </div>
                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                    <LogOut />
                                    <Button varient="link"className="p-2 h-auto">Log out</Button>
                                </div>

                            </div>
                        </PopoverContent>


                    </Popover>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar