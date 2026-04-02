import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { sendStatusUpdateEmail } from "../utils/emailService.js";
import { User } from "../models/user.model.js";

// apply for internship
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Internship id is required.",
                success: false
            });
        }
        //check for duplicate application
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
        //Create notification for successful application
        const user = await User.findById(userId);
        // Create in-app notification
        await Notification.create({
            recipient: userId,
            type: 'applied',
            title: '✅ Application Submitted Successfully!',
            message: `You have successfully applied for ${job.title} at ${job.company?.name || 'the company'}.`,
            applicationId: newApplication._id,
            jobTitle: job.title,
            companyName: job.company?.name,
            newStatus: 'applied'
        });
        // notify admins about new application
        // Get all admin and recruiter users
        const adminUsers = await User.find({ role: { $in: ['admin', 'recruiter'] } })
        
        // Create notification for each admin
        for (const admin of adminUsers) {
            await Notification.create({
                recipient: admin._id,
                type: 'new_application',
                title: '📝 New Application Received!',
                message: `${user.fullname} has applied for ${job.title} at ${job.company?.name || 'your company'}.`,
                applicationId: newApplication._id,
                jobTitle: job.title,
                companyName: job.company?.name,
                newStatus: 'applied'
            });
        }
        //Send email confirmation to student
        await sendStatusUpdateEmail(
            user.email,
            user.fullname,
            job.title,
            job.company?.name || "the company",
            'applied',
            new Date().toLocaleDateString()
        );

        return res.status(201).json({
            message: "Internship applied successfully.",
            success: true
        });

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error while applying",
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
            //options:{sort:{createdAt:-1}},
            populate: {
                path: 'company',
                //options:{sort:{createdAt:-1}},
            }
        });

        if (!application || application.length === 0) {
            return res.status(200).json({
                application: [],
                success: true,
                message: "No applications found"
            });
        }

        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

//get all applicants of applied jobs by user

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
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
//update application status with notifications 
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        //if(!status) {
        // return res.status(400).json({
        // message:'Status is required.',
        // success:false
        //})
        //};

        const allowedStatus = [
            'applied',
            'shortlisted',
            'interview',
            'selected',
            'rejected'
        ];


        if (!status || !allowedStatus.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: 'Invalid status value.',
                success: false
            });
        }


        // Find application with populated data
        const application = await Application.findById(applicationId)
            .populate({
                path: 'job',
                populate: { path: 'company' }
            })
            .populate('applicant');

        if (!application) {
            return res.status(404).json({
                message: 'Application not found.',
                success: false
            });
        }

        const oldStatus = application.status;
        const newStatus = status.toLowerCase();


        // Update status
        application.status = newStatus;
        await application.save();

        // Get formatted date
        const applicationDate = new Date(application.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        //Create notification messages based on status
        let notificationTitle = "";
        let notificationMessage = "";

        switch (newStatus) {
            case 'selected':
                notificationTitle = "🎉 Congratulations! You've been SELECTED!";
                notificationMessage = `Great news! You have been selected for the position of ${application.job.title} at ${application.job.company?.name}. The HR team will contact you soon.`;
                break;
            case 'interview':
                notificationTitle = "📅 Interview Scheduled";
                notificationMessage = `Your application for ${application.job.title} at ${application.job.company?.name} has been shortlisted for an interview. Please check your email for scheduling details.`;
                break;
            case 'shortlisted':
                notificationTitle = "✨ You've been Shortlisted!";
                notificationMessage = `Congratulations! You have been shortlisted for the position of ${application.job.title} at ${application.job.company?.name}. We will contact you soon.`;
                break;
            case 'rejected':
                notificationTitle = "Application Status Update";
                notificationMessage = `Thank you for your interest in ${application.job.title} at ${application.job.company?.name}. Unfortunately, we have decided to move forward with other candidates.`;
                break;
            default:
                notificationTitle = "Application Status Updated";
                notificationMessage = `Your application for ${application.job.title} has been updated to ${newStatus}.`;
        }
        // Create in-app notification
        await Notification.create({
            recipient: application.applicant._id,
            type: newStatus,
            title: notificationTitle,
            message: notificationMessage,
            applicationId: application._id,
            jobTitle: application.job.title,
            companyName: application.job.company?.name,
            oldStatus: oldStatus,
            newStatus: newStatus
        });
        //Send email notification to user
        await sendStatusUpdateEmail(
            application.applicant.email,
            application.applicant.fullname,
            application.job.title,
            application.job.company?.name || "the company",
            newStatus,
            applicationDate
        );

        return res.status(200).json({
            message: 'Application status updated successfully and notification sent.',
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error while updating status",
            success: false
        });
    }
};
// get user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.id;
        
        // Find all notifications for the user, sorted by newest first
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50);
        
        // Count unread notifications
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            read: false
        });
         return res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
        
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching notifications"
        });
    }
};
//mark single notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        // Update notification to read = true
        const notification = await Notification.findByIdAndUpdate(
            notificationId, 
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
        
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while marking notification as read"
        });
    }
};
// mark all notification as read

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.id;
        
        // Update all unread notifications for this user
        const result = await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );
        
        return res.status(200).json({
            success: true,
            message: `Marked ${result.modifiedCount} notifications as read`
        });
         } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while marking all notifications as read"
        });
    }
};