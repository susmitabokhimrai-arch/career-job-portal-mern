import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    name:{
        description:String,
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    logo:{
        type:string
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{timestamps:true});