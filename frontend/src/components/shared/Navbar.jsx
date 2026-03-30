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
import { Building,Briefcase } from 'lucide-react';

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
        < nav className="w-full bg-white shadow-md sticky top-0 z-50">
            < div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-6">

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
                                        ${location.pathname === '/admin/companies' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`} >
                                     <Building className="w-4 h-4 mr-2 text-gray-500" />
                                     Companies</Link>
                                    </li>
                                    <li>
                                    <Link to="/admin/jobs"
                                     className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200
                                        ${location.pathname === '/admin/jobs' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`} >
                                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                    Jobs</Link>
                            </li>
                            </>
                            ) : (
                                <>
                                    <li className='cursor-pointer'><Link to="/">Home</Link></li>
                                    <li className='cursor-pointer'><Link to="/jobs">Jobs</Link></li>
                                    <li className='cursor-pointer'><Link to="/browse">Browse</Link></li>
                                    {/* ✅ Show Saved Jobs link only when student is logged in */}
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
                                <Avatar className=' w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-gray-200 shadow-sm'>
                                    <AvatarImage
                                     src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="user avatar"
                                        className='w-full h-full object-cover' 
                                        />

                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-6 border-0 outline-none shadow-lg bg-white rounded-xl">
                                <div className="flex gap-4 items-center mb-4 ">
                                    <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </Avatar>

                                    <div>
                                        <h4 className="font-medium">{user?.fullname || "User"}</h4>
                                        <p className="text-sm text-gray-500">{user?.profile?.bio || "Welcome to CareerYatra!"}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col text-gray-600 space-y-2'>
                                    {
                                        user && user.role === 'student' && (
                                            <div className='flex items-center gap-2 cursor-pointer hover:text-primary transition'>
                                                <User2 />
                                                <Button asChild variant="link" className="p-0">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition">
                                        <LogOut />
                                        <Button
                                            onClick={logoutHandler}
                                            variant="link"
                                            className="p-0"
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
        </nav>
    );
};

export default Navbar;