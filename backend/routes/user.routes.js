import express from "express";
import { login, register, logout, updateProfile} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticate.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
