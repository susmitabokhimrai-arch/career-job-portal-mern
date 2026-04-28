import {Company} from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req,res) => {
    try{
        const {companyName} = req.body;
        if(!companyName){
             return res.status(400).json({
            message:"Company name is required.",
            success:false
        });
    }
       // ========== Only check for non-deleted companies ==========
        let company = await Company.findOne({ name: companyName, isDeleted: false });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
    company = await Company.create({
        name:companyName,
        userId:req.id
    });
    return res.status(201).json({
        message:"Company registered successfully.",
        company,
        success:true
    })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// ========== Only get active companies (not deleted) ==========
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId, isDeleted: false });
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
   return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// get company by id
// ========== Only get if not deleted ==========
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findOne({ _id: companyId, isDeleted: false });
        if (!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
} catch (error) {
        console.log(error);
   return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// ========== Only update if not deleted ==========
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        console.log(name, description, website, location);
        
        let updateData = { name, description, website, location };
        
        // Only update logo if file is provided
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { returnDocument: 'after' } 
        );
if (!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// DELETE company by ID
export const softDeleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const company = await Company.findByIdAndUpdate(
            companyId,
            { 
                isDeleted: true,
                deletedAt: new Date()
            },
 { returnDocument: 'after' }
        );
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Company moved to trash",
            company: company
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to move company to trash"
        });
         }
}
// ========== Get all deleted companies (for Trash page) ==========
export const getDeletedCompanies = async (req, res) => {
    try {
        const userId = req.id;
        const deletedCompanies = await Company.find({ 
            userId,
            isDeleted: true
        }).sort({ deletedAt: -1 });
        
        return res.status(200).json({
            companies: deletedCompanies,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch deleted companies"
        });
    }
}
// ========== Restore company from trash ==========
export const restoreCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const company = await Company.findByIdAndUpdate(
            companyId,
            { 
                isDeleted: false,
                deletedAt: null
            },
           { returnDocument: 'after' }
        );
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Company restored successfully",
            company: company
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to restore company"
        });
         }
}

// ========== Permanently delete from trash ==========
export const permanentDeleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const company = await Company.findByIdAndDelete(companyId);
        
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }return res.status(200).json({
            success: true,
            message: "Company permanently deleted"
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to permanently delete company"
        });
    }
}