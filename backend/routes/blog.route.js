import express from "express";
import {
    createBlog,
    getBlogsByCategory,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} from "../controllers/blog.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);

// Admin only routes
router.post("/create", isAuthenticated, isAdmin, singleUpload, createBlog);
router.get("/", isAuthenticated, isAdmin, getAllBlogs);
router.put("/:id", isAuthenticated, isAdmin, singleUpload, updateBlog);
router.delete("/:id", isAuthenticated, isAdmin, deleteBlog);

export default router;