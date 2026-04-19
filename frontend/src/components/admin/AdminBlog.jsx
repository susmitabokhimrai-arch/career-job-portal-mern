import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { BLOG_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, BookOpen, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const AdminBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "career_advice",
        published: true,
    });
    const [coverImage, setCoverImage] = useState(null);

    const adminNavItems = [
        { label: "Manage Recruiters", path: "/admin/manage-recruiter" },
        { label: "📝 Articles", path: "/admin/blog" },
    ];

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${BLOG_API_END_POINT}/`, {
                withCredentials: true
            });
            if (res.data.success) setBlogs(res.data.blogs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({ title: "", content: "", category: "career_advice", published: true });
        setCoverImage(null);
        setEditingBlog(null);
        setShowForm(false);
    };

    const handleEdit = (blog) => {
        setForm({
            title: blog.title,
            content: blog.content,
            category: blog.category,
            published: blog.published,
        });
        setEditingBlog(blog);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error("Title and content are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("category", form.category);
        formData.append("published", form.published);
        if (coverImage) formData.append("file", coverImage);

        try {
            setSubmitting(true);
            if (editingBlog) {
                const res = await axios.put(
                    `${BLOG_API_END_POINT}/${editingBlog._id}`,
                    formData,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success("Article updated successfully!");
                    fetchBlogs();
                    resetForm();
                }
            } else {
                const res = await axios.post(
                    `${BLOG_API_END_POINT}/create`,
                    formData,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success("Article created successfully!");
                    fetchBlogs();
                    resetForm();
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this article?")) return;
        try {
            const res = await axios.delete(`${BLOG_API_END_POINT}/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Article deleted.");
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Failed to delete article.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Admin Quick Nav */}
            <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-2 flex-wrap shadow-sm">
                {adminNavItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            location.pathname === item.path
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Manage Articles</h1>
                            <p className="text-sm text-gray-400">Create and manage Career Advice & Resume Tips</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Article
                    </Button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-5">
                            {editingBlog ? "✏️ Edit Article" : "✨ Create New Article"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter article title"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                                >
                                    <option value="career_advice">Career Advice</option>
                                    <option value="resume_tips">Resume Tips</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Content *</label>
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    placeholder="Write your article content here..."
                                    rows={10}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Cover Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCoverImage(e.target.files[0])}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={form.published}
                                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                    className="w-4 h-4 accent-indigo-600"
                                />
                                <label htmlFor="published" className="text-sm text-gray-700">
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {submitting
                                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</>
                                    : editingBlog ? "Update Article" : "Publish Article"
                                }
                            </Button>
                            <Button
                                onClick={resetForm}
                                variant="outline"
                                className="border-gray-300 text-gray-600"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Articles List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No articles yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "New Article" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition"
                            >
                                {blog.coverImage ? (
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        blog.category === "career_advice" ? "bg-indigo-50" : "bg-emerald-50"
                                    }`}>
                                        {blog.category === "career_advice"
                                            ? <BookOpen className="w-7 h-7 text-indigo-400" />
                                            : <FileText className="w-7 h-7 text-emerald-400" />
                                        }
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 truncate">{blog.title}</h3>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                        {blog.content.replace(/<[^>]+>/g, "").substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            blog.category === "career_advice"
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                            {blog.category === "career_advice" ? "Career Advice" : "Resume Tips"}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            blog.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {blog.published ? "Published" : "Draft"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 transition"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBlog;