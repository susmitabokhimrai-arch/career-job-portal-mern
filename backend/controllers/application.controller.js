import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

//apply for internship
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Internship id is required.",
                success: false
            })
        };
        //check if the user has already applied for job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied.",
                success: false
            });
        }
        // check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Internship not found.",
                success: false
            });
        }
        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Internship applied successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        // return error response
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};
// get student applied internships
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            populate: {
                path: 'company',
            }
        });

        if (!application || application.length === 0) {
            return res.status(404).json({
                message: "No Applications found.",
                success: false
            });
        }
        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
        // return error response
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};
//admin can check total no. of applied jobs by user

export const getApplicants = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Internship not found.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};
// update application status ATS logic
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const allowedStatus = [
            'applied',
            'shortlisted',
            'interview',
            'selected',
            'rejected'
        ];
        //  Validate status
        if (!status || !allowedStatus.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: 'Invalid status value.',
                success: false
            });
        }

        // find application by application id
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: 'Application not found.',
                success: false
            });
        };

        // update status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message: 'Application status updated successfully.',
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            success: false
        });
    }
};