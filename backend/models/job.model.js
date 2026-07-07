import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
     description:{
        type:String,
        required:true
    },
    requirements:[{
        type:String
    }],

    // intership fields

     stipend:{
        type:Number,
        min: [0, 'Stipend cannot be negative'],
         default: 0 
    },

    internshipType:{
type:String,
 enum: ["Full-time", "Part-time", "Remote", "Hybrid"],
required:true,
// converts lowercase to proper case
        set: function(value) {
            if (!value) return value;
            // Define mapping for common variations
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
            // Check if lowercase version exists in map
            const lowerValue = value.toLowerCase();
            if (typeMap[lowerValue]) {
                return typeMap[lowerValue];
            }
            
            // Otherwise, capitalize first letter of each word
            return value.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join('-');
        }
    },
    location:{
        type:String,
        required:[true, 'Location is required']
    },
    duration:{
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1']
    },
    skillsRequired:[{
        type:String
    }],
     applicationDeadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    startDate:{
        type:Date,
        required: [true, 'Start date is required']
    },
    perks:[{
        type:String // certificate
    }],
    position:{
        type: Number,
        required: [true, 'Number of positions is required'],
        min: [1, 'Number of positions must be at least 1']
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required: [true, 'Company is required']
    },
    created_by:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true, 'Creator is required']
    },
    applications:[
        {
             type:mongoose.Schema.Types.ObjectId,
        ref:'Application',
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false,           // false = active job, true = in trash
        index: true               // For faster queries
    },
    deletedAt: {
        type: Date,
        default: null             // When job was moved to trash
    }
 },{timestamps:true});
 // Compound index for better performance
jobSchema.index({ created_by: 1, isDeleted: 1 });
 
// ========== CHANGE 9: Pre-save middleware to ensure numbers ==========
jobSchema.pre('save', function(next) {
    // Ensure stipend is a number
    if (this.stipend !== undefined && this.stipend !== null) {
        this.stipend = Number(this.stipend);
    }
    
    // Ensure duration is a number
    if (this.duration !== undefined && this.duration !== null) {
        this.duration = Number(this.duration);
    }
    
    // Ensure position is a number
    if (this.position !== undefined && this.position !== null) {
        this.position = Number(this.position);
    }
    
    next();
});
// ========== CHANGE 10: Method to validate job data ==========
jobSchema.methods.validateData = function() {
    const errors = [];
    
    // Check position
    if (this.position < 1 || !Number.isInteger(this.position)) {
        errors.push('Position must be a positive integer');
    }
    
    // Check duration
    if (this.duration < 1 || !Number.isInteger(this.duration)) {
        errors.push('Duration must be a positive integer');
    }
    
    // Check stipend
    if (this.stipend < 0) {
        errors.push('Stipend cannot be negative');
    }
return errors;
};

export const Job = mongoose.model("Job", jobSchema);