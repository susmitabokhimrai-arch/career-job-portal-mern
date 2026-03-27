import express from "express";
import { login, register, logout, updateProfile, toggleSaveJob} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// Save/Unsave job
router.post("/save/:id", isAuthenticated, toggleSaveJob);
export default router;
