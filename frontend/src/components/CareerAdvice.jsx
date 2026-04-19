import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BLOG_API_END_POINT } from "@/utils/constant";
import { Loader2, BookOpen, Clock, User } from "lucide-react";

const CareerAdvice = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${BLOG_API_END_POINT}/category/career_advice`);
                if (res.data.success) {
                    setBlogs(res.data.blogs);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const getTimeAgo = (date) => {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-3">Career Advice</h1>
                    <p className="text-indigo-200 text-lg">
                        Expert tips and guidance to help you navigate your career journey.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600">No articles yet</h3>
                        <p className="text-gray-400 mt-2">Check back soon for career advice articles.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                onClick={() => navigate(`/blog/${blog._id}`)}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                            >
                                {blog.coverImage ? (
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-indigo-300" />
                                    </div>
                                )}

                                <div className="p-5">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                        Career Advice
                                    </span>
                                    <h2 className="text-gray-800 font-semibold text-lg mt-3 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm line-clamp-3">
                                        {blog.content.replace(/<[^>]+>/g, "")}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <User className="w-3 h-3" />
                                            {blog.author?.fullname || "Admin"}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {getTimeAgo(blog.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerAdvice;