import express from "express";
<<<<<<< HEAD
import { login, register, updateProfile} from "../controllers/user.controllers.js";
=======
import { login, register, logout, updateProfile} from "../controllers/user.controller.js";
>>>>>>> d1709cc (user testing done through postman)
import isAuthenticated from "../middlewares/isAuthenticate.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
