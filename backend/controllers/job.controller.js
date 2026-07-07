import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

// Validate job data 
const validateJobData = (data) => {
    const errors = [];
    
    // Validate position (must be >= 1)
    if (data.position !== undefined && data.position !== null && data.position !== "") {
        const positionNum = Number(data.position);
        if (isNaN(positionNum) || positionNum < 1) {
            errors.push('Number of positions must be at least 1');        
        }
     }
    
    // Validate duration (must be >= 1)
    if (data.duration !== undefined && data.duration !== null && data.duration !== "") {
        const durationNum = Number(data.duration);
        if (isNaN(durationNum) || durationNum < 1) {
            errors.push('Duration must be at least 1');
        }
    }
// Validate stipend (must be >= 0)
    if (data.stipend !== undefined && data.stipend !== null && data.stipend !== "") {
        const stipendNum = Number(data.stipend);
        if (isNaN(stipendNum) || stipendNum < 0) {
            errors.push('Stipend cannot be negative');
        }
    }
    
    return errors;
};

export const postJob = async (req, res) => {
    try {
        // restrict to recruiter
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can post jobs",
                success: false,
            });
        }

        const { 
            title, description, requirements, stipend, location, 
            internshipType, duration, skillsRequired, position, 
            companyId, applicationDeadline, startDate, perks 
        } = req.body;

        const userId = req.id;

        // Validate required fields
       if (!title || !description || !location || !internshipType || !duration || !position || !companyId) {
            return res.status(400).json({
                message: "Missing required fields. Please fill all required fields.",
                success: false
            });
        }
        // Validate all numeric fields
        const validationErrors = validateJobData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors,
                success: false
            });
        }
        // Convert string values to numbers 
        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements)
                ? requirements
                : requirements?.split(",") || [],
            stipend: stipend ? Number(stipend) : 0, // Ensure it's a number
            internshipType,
            duration: Number(duration), // Ensure it's a number
            skillsRequired: skillsRequired
                ? (Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(","))
                : [],
            perks: perks
            ? (Array.isArray(perks) ? perks : perks.split(","))
                : [],
            position: Number(position), // Ensure it's a number
            location,
            applicationDeadline,
            startDate,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New Internship posted successfully.",
            job,
            success: true
        });
         } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// students get all internship
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const duration = req.query.duration;
        const internshipType = req.query.internshipType;

// Shows old jobs (no isDeleted field) AND new active jobs 
        let query = {
            $or: [
                { isDeleted: { $exists: false } },  // Old jobs created before trash feature
                { isDeleted: false }                 // New active jobs
            ],
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                    ]
                }
            ]
        };


        if (duration) {
            query.duration = duration;
        }

        if (internshipType) {
            query.internshipType = internshipType;
        }

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// student get internship by id (works for old AND new jobs) 
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Internship ID",
                success: false
            });
        }

// Shows old jobs OR new active jobs 
        const job = await Job.findOne({ 
            _id: jobId,
            $or: [
                { isDeleted: { $exists: false } },  // Old jobs
                { isDeleted: false }                 // New active jobs
            ]
        }) 
            .populate({ path: "applications" })
            .populate({ path: "company" });

        if (!job) {
            return res.status(404).json({
                message: "Internship not found.",
                success: false
            });
        }
        return res.status(200).json({ job, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// recruiter - get all internships created (works for old AND new jobs) 
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

       // Shows old jobs OR new active jobs for this recruiter 
        const jobs = await Job.find({ 
            created_by: adminId,
            $or: [
                { isDeleted: { $exists: false } },  // Old jobs
                { isDeleted: false }                 // New active jobs
            ]
        })  
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// Update job (works for old AND new jobs) 
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Internship ID",
                success: false
            });
        }

        const { 
            title, description, requirements, stipend, location, 
            internshipType, duration, skillsRequired, position, 
            companyId, applicationDeadline, startDate, perks 
        } = req.body;

        // Validate all numeric fields 
        const validationErrors = validateJobData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors,
                success: false
            });
        }
// Build update data with number conversion 
        const updateData = {};
        
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (requirements !== undefined) {
            updateData.requirements = Array.isArray(requirements) 
                ? requirements 
                : requirements.split(",");
        }
        if (stipend !== undefined) {
            updateData.stipend = stipend ? Number(stipend) : 0;
        }
        if (internshipType !== undefined) updateData.internshipType = internshipType;
        if (duration !== undefined) {
            updateData.duration = Number(duration);
        }
        if (skillsRequired !== undefined) {
            updateData.skillsRequired = skillsRequired
                ? (Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(","))
                : [];
        }
        if (position !== undefined) {
            updateData.position = Number(position);
        }
        if (location !== undefined) updateData.location = location;
        if (applicationDeadline !== undefined) updateData.applicationDeadline = applicationDeadline;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (companyId !== undefined) updateData.company = companyId;
        if (perks !== undefined) {
            updateData.perks = perks
                ? (Array.isArray(perks) ? perks : perks.split(","))
                : [];
        }

// Can update old jobs OR new active jobs 
        const updatedJob = await Job.findOneAndUpdate(
            { 
                _id: jobId,
                $or: [
                    { isDeleted: { $exists: false } },  
                    { isDeleted: false }                 
                ]
            },   
            updateData, 
            { returnDocument: 'after' }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Internship not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Internship updated successfully",
            job: updatedJob,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Server error while updating job",
            success: false
        });
    }
};

// SOFT DELETE JOB (Move to Trash) 
export const softDeleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findOneAndUpdate(
            { _id: jobId, created_by: userId },
            { 
                isDeleted: true,
                deletedAt: new Date()
            },
           { returnDocument: 'after' }
        );
 if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or you don't have permission"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job moved to trash",
            job
        });
         } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to move job to trash"
        });
    }
};
// GET DELETED JOBS (Trash page) 
export const getDeletedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const deletedJobs = await Job.find({ 
            created_by: userId,
            isDeleted: true
        })
        .populate({ path: 'company' })
        .sort({ deletedAt: -1 });

        return res.status(200).json({
            jobs: deletedJobs,
            success: true
        });
        } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch deleted jobs"
        });
    }
};
// RESTORE JOB FROM TRASH 
export const restoreJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findOneAndUpdate(
            { _id: jobId, created_by: userId, isDeleted: true },
            { 
                isDeleted: false,
                deletedAt: null
            },
{ returnDocument: 'after' }        );
if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found in trash"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job restored successfully",
            job
        });
 } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to restore job"
        });
    }
};
// PERMANENTLY DELETE JOB FROM TRASH 
export const permanentDeleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findOneAndDelete({ 
            _id: jobId, 
            created_by: userId,
            isDeleted: true 
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found in trash"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Job permanently deleted"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to permanently delete job"
        });
    }
};
// recommendation based (works for old AND new jobs) 
export const getRecommendedJobs = async (req, res) => {
    try {
        const user = req.user;
        const skills = user.profile?.skills || [];

        if (!skills.length) {
            return res.status(200).json({
                success: true,
                jobs: [],
                message: "No skills found. Add skills to get recommendations."
            });
        }
        // Shows old jobs OR new active jobs 
        const jobs = await Job.find({
            $or: [
                { isDeleted: { $exists: false } }, 
                { isDeleted: false }                 
            ],
            requirements: { $in: skills }
        });

        const rankedJobs = jobs
            .map(job => {
                const matchCount = job.requirements.filter(skill =>
                    skills.includes(skill)
                ).length;

                return {
                    ...job.toObject(),
                    matchedSkillsCount: matchCount
                };
            })
            .sort((a, b) => b.matchedSkillsCount - a.matchedSkillsCount)
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            count: rankedJobs.length,
            jobs: rankedJobs
        });

    } catch (error) {
        console.error("Recommendation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recommended jobs"
        });
    }
};