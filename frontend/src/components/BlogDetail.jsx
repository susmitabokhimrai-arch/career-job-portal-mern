import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BLOG_API_END_POINT } from "@/utils/constant";
import { Loader2, ArrowLeft, User, Clock, BookOpen, FileText } from "lucide-react";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${BLOG_API_END_POINT}/${id}`);
                if (res.data.success) {
                    setBlog(res.data.blog);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const getTimeAgo = (date) => {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="text-center py-32">
                    <p className="text-gray-500 text-lg">Article not found.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const isCareerAdvice = blog.category === "career_advice";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate(isCareerAdvice ? "/career-advice" : "/resume-tips")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {isCareerAdvice ? "Career Advice" : "Resume Tips"}
                </button>

                {/* Article */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Cover Image */}
                    {blog.coverImage ? (
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-64 object-cover"
                        />
                    ) : (
                        <div className={`w-full h-64 flex items-center justify-center ${
                            isCareerAdvice
                                ? "bg-gradient-to-br from-indigo-100 to-purple-100"
                                : "bg-gradient-to-br from-emerald-100 to-teal-100"
                        }`}>
                            {isCareerAdvice
                                ? <BookOpen className="w-16 h-16 text-indigo-300" />
                                : <FileText className="w-16 h-16 text-emerald-300" />
                            }
                        </div>
                    )}

                    <div className="p-8">
                        {/* Category Badge */}
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                            isCareerAdvice
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-emerald-600 bg-emerald-50"
                        }`}>
                            {isCareerAdvice ? "Career Advice" : "Resume Tips"}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-4">
                            {blog.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {blog.author?.fullname || "Admin"}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {getTimeAgo(blog.createdAt)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                            {blog.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;