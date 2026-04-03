import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { 
    postJob,
    getAllJobs,
    getAdminJobs,
    getJobById,
    updateJob 
} from "../controllers/job.controller.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create internship 
router.post("/", isAuthenticated, postJob);

// Get all internships 
router.get("/", getAllJobs);

// Get admin internships
router.get("/admin", isAuthenticated, getAdminJobs);

// Specific routes first
router.put("/update/:id", isAuthenticated, updateJob);

// Dynamic route last
router.get("/:id", getJobById);  

// recruiter only
router.post("/create", isAuthenticated, isRecruiter, postJob);


export default router;