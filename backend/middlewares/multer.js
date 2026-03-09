import multer from "multer";

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory

export const singleUpload = multer({storage}).single("file");
