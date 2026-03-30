import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bookmark, LogOut, User2 } from 'lucide-react';
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
        < nav className="w-full bg-white shadow-md sticky top-0 z-50">
            < div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

                <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary">
                    Career<span className="text-blue-400">Yatra</span>
                </h1>
                <div className='flex items-center space-x-6'>
                    <ul className="flex items-center space-x-6 font-medium list-none p-0 m-0">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className='hover:text-secondary transition-colors cursor-pointer'>
                                        <Link to="/admin/companies">Companies</Link>
                                    </li>
                                    <li className='hover:text-secondary transition-colors cursor-pointer'>
                                        <Link to="/admin/jobs">Jobs</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-500 transition-colors duration-200"
                                        >
                                            Home
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/jobs"
                                            className="hover:text-blue-500 transition-colors duration-200"
                                        >
                                            Jobs
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/browse"
                                            className="hover:text-blue-500 transition-colors duration-200"
                                        >
                                            Browse
                                        </Link>
                                    </li>

                                    {/* Saved Jobs */}
                                    {user && user.role === 'student' && (
                                        <li className='hover:text-secondary transition-colors cursor-pointer'>
                                            <Link to="/saved-jobs" className="flex items-center gap-1">
                                                <Bookmark size={15} />
                                                Saved Jobs
                                            </Link>
                                        </li>
                                    )}
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
                                <Avatar className='w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-purple-600 shadow-lg'>
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="user avatar"
                                        className='w-full h-full object-cover'
                                    />
                                </Avatar>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-6 border-0 outline-none shadow-2xl bg-white rounded-2xl animate-fadeIn">

                                {/* Top: Avatar + Info */}
                                <div className="flex gap-4 items-center mb-4">
                                    <Avatar className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 shadow-md">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                            alt="profile"
                                            className="object-cover"
                                        />
                                    </Avatar>

                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-900">{user?.fullname || "User"}</h4>
                                        <p className="text-sm text-gray-500">{user?.profile?.bio || "Welcome to CareerYatra!"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-3">

                                    {/* View Profile */}
                                    {user && user.role === 'student' && (
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition">
                                            <User2 className="text-purple-600 w-5 h-5" />
                                            <span className="text-gray-900 font-medium">View Profile</span>
                                        </Link>
                                    )}

                                    {/* Logout */}
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                                    >
                                        <LogOut className="text-red-600 w-5 h-5" />
                                        <span className="text-red-600 font-medium">Log out</span>
                                    </button>

                                </div>

                                {/* Optional: Footer Note */}
                                <p className="text-xs text-gray-400 mt-4 text-center">CareerYatra © 2026</p>

                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;