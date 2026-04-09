import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authslice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false); //For show/hide password
  const [passwordError, setPasswordError] = useState("");  // For password error message
  const [emailError, setEmailError] = useState("");  // For email error message
  const [shake, setShake] = useState(false);   // For shake animation
  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (e.target.name === "password") {
      setPasswordError("");
    }
    if (e.target.name === "email") {
      setEmailError("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.role) {
      return toast.error("Please select a role");
    }
    // Clear previous errors
    setPasswordError("");
    setEmailError("");
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      // Handle different error types
      if (error.response?.data?.message?.toLowerCase().includes("password")) {
        setPasswordError(error.response.data.message);
        setShake(true);
        setTimeout(() => setShake(false), 500);  // Remove shake after 0.5s
      }
      else if (error.response?.data?.message?.toLowerCase().includes("email") ||
        error.response?.data?.message?.toLowerCase().includes("not found")) {
        setEmailError(error.response.data.message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      dispatch(setLoading(false));
    }
  }

    // Handle forgot password
    const handleForgotPassword = () => {
      toast.info("Password reset link will be sent to your email", {
        duration: 3000,
      });
    };

    useEffect(() => {
      if (user) {
        navigate("/");
      }
    }, [user, navigate]);

    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <Navbar />

        <div className="flex items-center justify-center px-4">
          <form
            onSubmit={submitHandler}
            className={`w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12 border border-gray-100 transition-all duration-300 ${shake ? "animate-shake" : ""
              }`}
          >
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome Back 👋
            </h1>
            {/* Email */}
            <div className="mb-4">
              <Label className="text-gray-700">Mobile number or email </Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="mt-1 focus:ring-2 focus:ring-indigo-400"
              />
              {/* Email error msg */}
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            {/* Password Field with Show/Hide Toggle */}
            <div className="mb-2">
              <Label className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}  // ← TOGGLES type
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="Enter your Password"
                  className={`mt-1 focus:ring-2 focus:ring-indigo-400 pr-10 ${passwordError ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                />
                {/* Eye icon button*/}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Password error msg */}
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <Label className="text-gray-700 block mb-2">Select Role</Label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                  />
                  Student
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                  />
                  Recruiter
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={input.role === "admin"}
                    onChange={changeEventHandler}
                  />
                  Admin
                </label>
              </div>
            </div>
            {
              loading ? <Button className="w-full my-4"> <Loader2 className="mr-2 h-4 animate-spin" />Please Wait</Button> : <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
              >
                Login
              </Button>
            }


            <span className="text-center text-sm text-gray-700 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-700 font-semibold cursor-pointer hover:underline"
              >
                Signup
              </Link>
            </span>
          </form>
        </div>
      </div>
    );
  };

  export default Login;