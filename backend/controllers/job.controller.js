import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

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

        if (!title || !description || !requirements || !location || !internshipType || !duration || !position || !companyId) {
            return res.status(400).json({
                message: "something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,

            // ✅ FIX: handle both string and array
            requirements: Array.isArray(requirements)
                ? requirements
                : requirements.split(","),

            stipend,
            internshipType,
            duration,

            // ✅ FIX: handle both string and array
            skillsRequired: skillsRequired
                ? (Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(","))
                : [],

            // ✅ FIX: handle both string and array
            perks: perks
                ? (Array.isArray(perks) ? perks : perks.split(","))
                : [],

            position,
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
        const internshipType = req.query.intershipType;

        let query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
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

// student get internship by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Internship ID",
                success: false
            });
        }

        const job = await Job.findById(jobId)
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

// recruiter - get all internships created
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

        const jobs = await Job.find({ created_by: adminId })
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

// Update job
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

        const updateData = {
            title,
            description,

            // already correct ✅
            requirements: requirements
                ? (Array.isArray(requirements) ? requirements : requirements.split(","))
                : [],

            stipend,
            internshipType,
            duration,

            skillsRequired: skillsRequired
                ? (Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(","))
                : [],

            perks: perks
                ? (Array.isArray(perks) ? perks : perks.split(","))
                : [],

            position,
            location,
            applicationDeadline,
            startDate,
            company: companyId
        };

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

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

// recommendation based 
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

        const jobs = await Job.find({
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