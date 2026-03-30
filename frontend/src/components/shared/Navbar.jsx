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
        <div className="w-full bg-white">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

                <h1 className="text-5xl font-bold">
                    Career<span className="text-blue-400">Yatra</span>
                </h1>
                <div className='flex items-center space-x-5'>
                    <ul className="flex items-center gap-6 font-medium text-gray-700">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/companies"
                                            className="hover:text-blue-500 transition-colors duration-200"
                                        >
                                            Companies
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/jobs"
                                            className="hover:text-blue-500 transition-colors duration-200"
                                        >
                                            Jobs
                                        </Link>
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
                                        <li>
                                            <Link
                                                to="/saved-jobs"
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
                                            >
                                                <Bookmark size={16} />
                                                Saved
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
                                <Avatar className=' w-7 h-7 rounded-full overflow-hidden cursor-pointer '>
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="@shadcn"
                                        className='w-full h-full object-cover' />

                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 border border-gray-100 shadow-xl rounded-xl overflow-hidden bg-white">

                                {/* Top Profile Section */}
                                <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                            alt="profile"
                                            className="object-cover"
                                        />
                                    </Avatar>

                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {user?.fullname || "User"}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {user?.profile?.bio || "Welcome to CareerYatra!"}
                                        </p>
                                    </div>
                                </div>

                                {/* Menu Section */}
                                <div className="flex flex-col p-2">

                                    {/* View Profile */}
                                    {user && user.role === "student" && (
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            <User2 className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                View Profile
                                            </span>
                                        </Link>
                                    )}

                                    {/* Logout */}
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer text-left"
                                    >
                                        <LogOut className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-500">
                                            Logout
                                        </span>
                                    </button>
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