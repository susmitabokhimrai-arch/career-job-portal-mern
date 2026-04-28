import express from "express";
import isAuthenticated from "../middlewares/isAuthenticate.js";
import { singleUpload } from "../middlewares/multer.js";
import { getCompany,  registerCompany,  getCompanyById,  updateCompany, softDeleteCompany, getDeletedCompanies, restoreCompany,  permanentDeleteCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
router.route("/soft-delete/:id").delete(isAuthenticated, softDeleteCompany);
router.route("/trash").get(isAuthenticated, getDeletedCompanies);    
router.route("/restore/:id").put(isAuthenticated, restoreCompany);  
router.route("/permanent-delete/:id").delete(isAuthenticated, permanentDeleteCompany); 

export default router;