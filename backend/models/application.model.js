import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    // internship ATS status system
    status:{
        type:String,
        enum:[
            //'pending','accepted','rejected'
        'applied',
    'shortlisted',
'interview',
'selected',
'rejected'
],
        default:'applied'
  }
},{timestamps:true});
export const Application = mongoose.model("Application",applicationSchema);
