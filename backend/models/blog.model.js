import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["career_advice", "resume_tips"],
        required: true
    },
    coverImage: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    published: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema);