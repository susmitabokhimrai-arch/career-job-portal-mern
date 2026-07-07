import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    requirements: [{
        type: String
    }],
    stipend: {
        type: Number,
        min: [0, 'Stipend cannot be negative'],
        default: 0
    },
    internshipType: {
        type: String,
        enum: ["Full-time", "Part-time", "Remote", "Hybrid"],
        required: [true, 'Internship type is required'],
        set: function(value) {
            if (!value) return value;
            const typeMap = {
                'remote': 'Remote',
                'hybrid': 'Hybrid',
                'full-time': 'Full-time',
                'part-time': 'Part-time',
                'fulltime': 'Full-time',
                'parttime': 'Part-time',
                'REMOTE': 'Remote',
                'HYBRID': 'Hybrid',
                'FULL-TIME': 'Full-time',
                'PART-TIME': 'Part-time'
            };
            const lowerValue = value.toLowerCase();
            if (typeMap[lowerValue]) {
                return typeMap[lowerValue];
            }
            return value.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join('-');
        }
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
    },
    skillsRequired: [{
        type: String
    }],
    applicationDeadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    perks: [{
        type: String
    }],
    position: {
        type: Number,
        required: [true, 'Number of positions is required'],
        min: [1, 'Number of positions must be at least 1']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required']
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Compound index for better performance
jobSchema.index({ created_by: 1, isDeleted: 1 });


export const Job = mongoose.model("Job", jobSchema);