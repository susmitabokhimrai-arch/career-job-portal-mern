import { Blog } from "../models/blog.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Create article (admin only)
export const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, content and category are required."
            });
        }

        let coverImage = "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            coverImage = cloudResponse.secure_url;
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            coverImage,
            author: req.id
        });

        return res.status(201).json({
            success: true,
            message: "Article created successfully.",
            blog
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all articles by category (public)
export const getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const blogs = await Blog.find({ category, published: true })
            .populate("author", "fullname")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all articles (admin)
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "fullname")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get single article (public)
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "fullname");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Article not found."
            });
        }

        return res.status(200).json({ success: true, blog });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update article (admin only)
export const updateBlog = async (req, res) => {
    try {
        const { title, content, category, published } = req.body;

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Article not found."
            });
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (published !== undefined) blog.published = published;

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            blog.coverImage = cloudResponse.secure_url;
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Article updated successfully.",
            blog
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete article (admin only)
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Article not found."
            });
        }

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Article deleted successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};