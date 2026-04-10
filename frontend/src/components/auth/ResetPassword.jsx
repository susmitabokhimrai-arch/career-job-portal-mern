import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    // Verify token is valid
    const verifyToken = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/verify-reset-token/${token}`);
        if (!res.data.success) {
          setValidToken(false);
        }
      } catch (error) {
        setValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        { password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <Navbar />
        <div className="flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">Invalid or expired reset link</p>
                <p className="text-red-600 text-sm mt-2">
                  Please request a new password reset link.
                </p>
              </div>
              <Link to="/forgot-password">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full">
                  Request New Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12 border border-gray-100">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">CareerYatra</h1>
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create New Password
          </h2>

          <form onSubmit={submitHandler}>
            {/* New Password Field */}
            <div className="mb-4">
              <Label className="text-gray-700">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1 bg-gray-100 border-none rounded-full py-3 px-5 pr-12 focus:ring-1 focus:ring-indigo-400 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <Label className="text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-1 bg-gray-100 border-none rounded-full py-3 px-5 pr-12 focus:ring-1 focus:ring-indigo-400 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;