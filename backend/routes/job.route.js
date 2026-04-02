import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { postJob,
    getAllJobs,
    getAdminJobs,
    getJobById
 } from "../controllers/job.controller.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// router.route("/post").post(isAuthenticated, postJob);
// router.route("/get").get(isAuthenticated, getAllJobs);
// router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
// router.route("/get/:id").get(isAuthenticated, getJobById);

// Create internship
router.post("/", isAuthenticated, postJob);

//  Get all internships (students)
router.get("/", getAllJobs);

//  recruiter get own internships
router.get("/admin", isAuthenticated, getAdminJobs);

//  student Get single internship
router.get("/:id", getJobById);

// recruiter only
router.post("/create", isAuthenticated, isRecruiter, postJob);


export default router;