import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllAsRead 
} from "../controllers/application.controller.js";

const router = express.Router();

// Test- Add this temporarily
router.get("/test", (req, res) => {
    res.json({ message: "Notification route is working!", success: true });
});

router.get("/", isAuthenticated, getUserNotifications);
router.put("/:id/read", isAuthenticated, markNotificationAsRead);
router.put("/read/all", isAuthenticated, markAllAsRead);

export default router;