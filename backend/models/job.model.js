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
        type:String
    },

    internshipType:{
type:String,
enum:["remote","onsite","hybrid"],
required:true
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
        type:Number,
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
    ]
 },{timestamps:true});
export const Job = mongoose.model("Job",jobSchema);