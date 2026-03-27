import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { postJob,
    getAllJobs,
    getAdminJobs,
    getJobById
 } from "../controllers/job.controller.js";


const router = express.Router();

// router.route("/post").post(isAuthenticated, postJob);
// router.route("/get").get(isAuthenticated, getAllJobs);
// router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
// router.route("/get/:id").get(isAuthenticated, getJobById);

// Create internship
router.post("/", isAuthenticated, postJob);

//  Get all internships (students)
router.get("/", getAllJobs);

//  Get admin internships
router.get("/admin", isAuthenticated, getAdminJobs);

//  Get single internship
router.get("/:id", getJobById);

export default router;