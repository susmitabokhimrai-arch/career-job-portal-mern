import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        setEmailSent(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 my-12 border border-gray-100">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">CareerYatra</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Forgot Password?
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your email and we'll send you a reset link
          </p>

          {!emailSent ? (
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <Label className="text-gray-700">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 bg-gray-100 border-none rounded-full py-3 px-5 focus:ring-1 focus:ring-indigo-400 w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700">
                  ✓ Reset link sent to <strong>{email}</strong>
                </p>
                <p className="text-green-600 text-sm mt-2">
                  Please check your email and click the link to reset your password.
                </p>
              </div>
              <Link to="/login">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;