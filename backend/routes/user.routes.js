import express from "express";
import { login, register, logout, updateProfile, toggleSaveJob, getSavedJobs, getRecommendedJobs} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";
import { isStudent } from "../middlewares/roleMiddleware.js";
// view resume
import { getResume } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile);
router.get("/saved", isAuthenticated, getSavedJobs);
router.get("/saved", isAuthenticated, isStudent, getSavedJobs);
// Save/Unsave job
router.post("/save/:id", isAuthenticated, toggleSaveJob);

// resume
router.get("/profile/resume", isAuthenticated, getResume);

// Recommendation route
router.get("/recommendations", isAuthenticated, getRecommendedJobs);
export default router; 