import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bookmark, LogOut, User2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authslice';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Building, Briefcase } from 'lucide-react';
import NotificationBell from '../NotificationBell';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

                <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary">
                    Career<span className="text-blue-500">Yatra</span>
                </h1>
                <div className='flex items-center space-x-6'>
                    <ul className="flex items-center space-x-4 font-medium list-none p-0 m-0">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link to="/admin/companies"
                                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${location.pathname.startsWith('/admin/companies') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}>
                                            <Building className="w-4 h-4 mr-2 text-gray-500" />
                                            Companies
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/jobs"
                                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${location.pathname.startsWith('/admin/jobs') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}>
                                            <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                            Jobs
                                        </Link>
                                    </li>
                                </>
                            ) : user && user.role === 'admin' ? (
                                <>
                                    <li>
                                        <Link to="/admin/manage-recruiter"
                                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${location.pathname === '/admin/manage-recruiter' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}>
                                            <User2 className="w-4 h-4 mr-2 text-gray-500" />
                                            Manage Recruiter
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/"
                                            className={'flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200' + (location.pathname === '/' ? ' bg-blue-100 text-blue-600' : ' text-gray-700 hover:bg-gray-100 hover:text-blue-600')}>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/jobs"
                                            className={'flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200' + (location.pathname === '/jobs' ? ' bg-blue-100 text-blue-600' : ' text-gray-700 hover:bg-gray-100 hover:text-blue-600')}>
                                            Jobs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/browse"
                                            className={'flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200' + (location.pathname === '/browse' ? ' bg-blue-100 text-blue-600' : ' text-gray-700 hover:bg-gray-100 hover:text-blue-600')}>
                                            Browse
                                        </Link>
                                    </li>
                                    {user && user.role === 'student' && (
                                        <li className="relative">
                                            <Link to="/saved-jobs"
                                                className={'flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200' + (location.pathname === '/saved-jobs' ? ' bg-blue-100 text-blue-600' : ' text-gray-700 hover:bg-gray-100 hover:text-blue-600')}>
                                                <Bookmark size={18} />
                                                {user.savedJobs && user.savedJobs.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                        {user.savedJobs.length}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )
                        }
                    </ul>
                    {/* NotificationBell for all logged-in users */}
                    {user && user.role !== "admin" && (
                        <div className="flex items-center">
                            <NotificationBell />
                        </div>
                    )}
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className="px-5 py-2 font-semibold rounded-full text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-blue-600 transition-all shadow-sm"
                            >
                                <Link to="/login">Login</Link>
                            </Button>

                            <Button
                                asChild
                                className="px-5 py-2 font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
                            >
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
                                    {user?.role === 'student' && (
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition">
                                            <User2 className="text-purple-600 w-5 h-5" />
                                            <span className="text-gray-900 font-medium">View Profile</span>
                                        </Link>
                                    )}
                                    {/* ✅ NEW: Recruiter profile link */}
                                    {user?.role === 'recruiter' && (
                                        <Link to="/recruiter/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                                            <User2 className="text-blue-600 w-5 h-5" />
                                            <span className="text-gray-900 font-medium">View Profile</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                                    >
                                        <LogOut className="text-red-600 w-5 h-5" />
                                        <span className="text-red-600 font-medium">Log out</span>
                                    </button>

                                </div>

                                {/* Footer Note */}
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