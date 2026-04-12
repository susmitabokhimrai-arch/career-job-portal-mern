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
getAllRecruiters,
removeRecruiter,
updateProfilePhoto,    
  togglePhotoPermission,
  forgotPassword, // ========== NEW IMPORTS FOR FORGOT PASSWORD ==========
  verifyResetToken,
    resetPassword,
    recruiterContactRequest  
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// Public Routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// ========== NEW: FORGOT PASSWORD ROUTES (PUBLIC) ==========
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-token/:token").get(verifyResetToken);
router.route("/reset-password/:token").post(resetPassword);
// Recruiter internship request (Public)
router.route("/recruiter-request").post(recruiterContactRequest);

// Authenticated Routes
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/job/save/:id").post(isAuthenticated, toggleSaveJob);
router.route("/job/saved").get(isAuthenticated, getSavedJobs);
router.route("/jobs/recommended").get(isAuthenticated, getRecommendedJobs);
router.route("/resume/:id").get(isAuthenticated, getResume);

// ── Admin-Only: Recruiter Management ─────────
// GET    /api/v1/user/admin/recruiters           → list all recruiters
// POST   /api/v1/user/admin/recruiters           → create a new recruiter
// DELETE /api/v1/user/admin/recruiters/:id       → remove & blacklist a recruiter
router.route("/admin/recruiters").get(isAuthenticated, isAdmin, getAllRecruiters);
router.route("/admin/recruiters").post(isAuthenticated, isAdmin, createRecruiter);
router.route("/admin/recruiters/:recruiterId").delete(isAuthenticated, isAdmin, removeRecruiter);
 // Recruiter: update own photo (admin must allow first)
router.route("/profile/photo").post(isAuthenticated, singleUpload, updateProfilePhoto);

// Admin: toggle photo permission for a recruiter
router.route("/admin/recruiters/:recruiterId/photo-permission").patch(isAuthenticated, isAdmin, togglePhotoPermission);
export default router;