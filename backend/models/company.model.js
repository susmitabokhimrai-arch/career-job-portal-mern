import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    logo:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false,           // false = active, true = in trash
        index: true               // Added index for faster queries
    },
    deletedAt: {
        type: Date,
        default: null             // When company was moved to trash
    }
},{timestamps:true});
// ========== OPTIONAL: Compound index for better performance ==========
// This helps when querying for companies by userId and isDeleted together
companySchema.index({ userId: 1, isDeleted: 1 });

// ========== OPTIONAL: Virtual field to check if in trash ==========
companySchema.virtual('isInTrash').get(function() {
    return this.isDeleted === true;
});

// ========== OPTIONAL: Ensure virtuals are included in JSON output ==========
companySchema.set('toJSON', { virtuals: true });
companySchema.set('toObject', { virtuals: true });

export const Company = mongoose.model("Company", companySchema);
