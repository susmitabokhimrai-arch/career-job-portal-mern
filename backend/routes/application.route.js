import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, deleteApplication  } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.put("/status/:id", isAuthenticated, updateStatus);
router.route("/:id").delete(isAuthenticated, deleteApplication);

export default router;