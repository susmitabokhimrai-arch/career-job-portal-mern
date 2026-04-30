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
    // requirements:[{
        //type:String
    //}],

    // intership fields

     stipend:{
        type:String
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
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    skillsRequired:[{
        type:String
    }],
    applicationDeadline:{
        type:Date
    },
    startDate:{
        type:Date
    },
    perks:[{
        type:String // certificate
    }],
    position:{
        type: String,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    created_by:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
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
 // ========== OPTIONAL: Compound index for better performance ==========
jobSchema.index({ created_by: 1, isDeleted: 1 });
export const Job = mongoose.model("Job",jobSchema);