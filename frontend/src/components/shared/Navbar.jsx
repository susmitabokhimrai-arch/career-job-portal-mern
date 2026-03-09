import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, User2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authslice';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }


        } catch (error) {
            console.error("Error occurred while logging out:", error);
            toast.error(error.response?.data?.message || "Something went wrong during logout");
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

                <h1 className="text-5xl font-bold">
                    Career<span className="text-blue-400">Yatra</span>
                </h1>
                <div className='flex items-center space-x-5'>
                    <ul className="flex items-center space-x-5 font-medium list-none p-0 m-0">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className='cursor-pointer'><Link to="/admin/companies">Companies</Link></li>
                                    <li className='cursor-pointer'><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className='cursor-pointer'><Link to="/">Home</Link></li>
                                    <li className='cursor-pointer'><Link to="/jobs">Jobs</Link></li>
                                    <li className='cursor-pointer'><Link to="/browse">Browse</Link></li>
                                </>

                            )
                        }

                    </ul>
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                <Link to="/signup">Signup</Link>
                            </Button>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className=' w-7 h-7 rounded-full overflow-hidden cursor-pointer '>
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="@shadcn"
                                        className='w-full h-full object-cover' />

                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-6 border-0 outline-none shadow-lg">
                                <div className="flex gap-6 space-y-1 space-x-2 ">
                                    <Avatar className="w-7 h-7 rounded-full overflow-hidden">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </Avatar>

                                    <div>
                                        <h4 className="font-medium">{user?.fullname || "User"}</h4>
                                        <p className="text-sm text-muted-foreground">{user?.profile?.bio || "Welcome to CareerYatra!"}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col text-gray-600 mt-4'>
                                    {
                                        user && user.role === 'student' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button asChild variant="link">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}
                                    <div className="flex w-fit items-center gap-2 cursor-pointer mt-2">
                                        <LogOut />
                                        <Button
                                            onClick={logoutHandler}
                                            variant="link"
                                            className="p-2 h-auto"
                                        >
                                            Log out
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;