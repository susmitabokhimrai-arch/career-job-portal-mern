import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { setLoading } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "", email: "", phoneNumber: "",
        password: "", role: "", file: "",
    });
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const changeFileHandler = (e) => setInput({ ...input, file: e.target.files?.[0] });

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) formData.append("file", input.file);

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                setShowOtp(true); // 👈 show OTP modal instead of navigating
                toast.success("OTP sent to your email!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server not running");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifyOtpHandler = async () => {
        try {
            setOtpLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
                email: input.email,
                otp,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success("Email verified! Please login.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
            <Navbar />
            <div className="flex items-center justify-center px-4">
                <form onSubmit={submitHandler}
                    className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12 border border-gray-100">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account 🚀</h1>

                    <div className="mb-4">
                        <Label className="text-gray-700">Full Name</Label>
                        <Input type="text" value={input.fullname} name="fullname"
                            onChange={changeEventHandler} placeholder="Enter your Name"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-gray-700">Email</Label>
                        <Input type="email" value={input.email} name="email"
                            onChange={changeEventHandler} placeholder="Enter your email"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-gray-700">Phone Number</Label>
                        <Input type="number" value={input.phoneNumber} name="phoneNumber"
                            onChange={changeEventHandler} placeholder="Enter your Phone number"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-gray-700">Password</Label>
                        <Input type="password" value={input.password} name="password"
                            onChange={changeEventHandler} placeholder="Enter your Password"
                            className="mt-1 focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-gray-700 block mb-2">Select Role</Label>
                        <div className="flex space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="role" value="student"
                                    checked={input.role === "student"} onChange={changeEventHandler} />
                                Student
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="role" value="recruiter"
                                    checked={input.role === "recruiter"} onChange={changeEventHandler} />
                                Recruiter
                            </label>
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label className="text-gray-700 block mb-2">Profile Image</Label>
                        <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer" />
                    </div>

                    {loading
                        ? <Button className="w-full my-4"><Loader2 className="mr-2 h-4 animate-spin" />Please Wait</Button>
                        : <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300">Signup</Button>
                    }
                    <span className="text-center text-sm text-gray-700 mt-4 block">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-700 font-semibold hover:underline">Login</Link>
                    </span>
                </form>
            </div>

            {/* ✅ OTP Modal */}
            {showOtp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            A 6-digit OTP was sent to <b>{input.email}</b>
                        </p>
                        <Input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="text-center text-xl tracking-widest mb-4"
                        />
                        <Button
                            onClick={verifyOtpHandler}
                            disabled={otpLoading || otp.length !== 6}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {otpLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            Verify OTP
                        </Button>
                        <p className="text-xs text-gray-400 mt-4">OTP expires in 2 minutes</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;