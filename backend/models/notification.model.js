import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['selected', 'interview', 'shortlisted', 'rejected', 'applied', 'status_update'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },
    jobTitle: String,
    companyName: String,
    oldStatus: String,
    newStatus: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Notification = mongoose.model("Notification", notificationSchema);