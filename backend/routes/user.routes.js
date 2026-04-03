import express from "express";
import { login, 
    register,
     logout,
      updateProfile, 
      toggleSaveJob, 
      getSavedJobs,
       getRecommendedJobs,
        getResume,
    createRecruiter,
getRecruiter,
removeRecruiter,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// Public Routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Authenticated Routes
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/job/save/:id").post(isAuthenticated, toggleSaveJob);
router.route("/job/saved").get(isAuthenticated, getSavedJobs);
router.route("/jobs/recommended").get(isAuthenticated, getRecommendedJobs);
router.route("/resume/:id").get(isAuthenticated, getResume);

// Admin only routes
// GET    /api/v1/user/admin/recruiter    (view current recruiter)
// POST   /api/v1/user/admin/recruiter        (create new recruiter)
// DELETE /api/v1/user/admin/recruiter/:id    (remove & blacklist recruiter)
router.route("/admin/recruiter").get(isAuthenticated, isAdmin, getRecruiter);
router.route("/admin/recruiter").post(isAuthenticated, isAdmin, createRecruiter);
router.route("/admin/recruiter/:recruiterId").delete(isAuthenticated, isAdmin, removeRecruiter);
 
export default router;