import express from "express";
import { login, register, logout, updateProfile, toggleSaveJob, getSavedJobs} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";
// view resume
import { getResume } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.get("/saved", isAuthenticated, getSavedJobs);

// Save/Unsave job
router.post("/save/:id", isAuthenticated, toggleSaveJob);

// resume
router.get("/profile/resume", isAuthenticated, getResume);
export default router;