import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try{
          console.log(req.body); 
        const { title, description, requirements, stipend, location, internshipType, duration, skillsRequired,  position, companyId, applicationDeadline, startDate, perks} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements ||  !location || !internshipType || !duration || !position || !companyId ){

            return res.status(400).json({
        message:"something is missing.",
        success:false
    });
            }

            const job = await Job.create({
title,
  description,
  requirements: requirements.split(","),  // ✅ convert to array
  stipend,
  internshipType,
  duration,
  skillsRequired: skillsRequired ? skillsRequired.split(",") : [], // ✅ convert to array
  perks: perks ? perks.split(",") : [], // ✅ convert to array
  position,
  location,
  applicationDeadline,
  startDate,
  company: companyId,
  created_by: userId
});

            return res.status(201).json({
        message:"Newb Intership posted successfully.",
        job,
        success:true
    });
        } catch(error) {
            console.log(error);
             return res.status(500).json({ message: error.message, success: false });
        }
    };

    // students get all intership
    export const getAllJobs = async (req,res) => {
        try{
            const keyword = req.query.keyword || "";
            const duration = req.query.duration;
            const internshipType = req.query.intershipType;

            let query={
                $or:[
                    {title: { $regex:keyword, $options:"i"} },
                    {description:{$regex:keyword, $options:"i"} },
                ]
                     };
                     // filters
                     if (duration) {
            query.duration = duration;
        }

        if (internshipType) {
            query.internshipType = internshipType;
        }
                     const jobs = await Job.find(query).populate({
                        path:"company"
                     }).sort({createdAt:-1});


        return res.status(200).json({
            jobs,
            success: true
        });
} catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
    };


                     //if(!jobs) {
                        //return res.status(404).json({
                           // message:"Jobs not found.",
                            //success:false
                        //})
                     //};
                     //return res.status(200).json({
                       // jobs,
                        //success:true
                    // })
        //} catch (error) {
           // console.log(error);
       // }
    //}

    // student get intership by id
    export const getJobById = async (req,res) => {
        try{
            const jobId = req.params.id;

              //  FIX: Prevent invalid IDs like "get"
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Internship ID",
                success: false
            });
        }
           // const job = await Job.findById(jobId).populate({
              //  path:"applications"
           // });

           const job = await Job.findById(jobId)
            .populate({ path: "applications" })
            .populate({ path: "company" }); // populate company

            
            if(!job){
                 return res.status(404).json({
        message:"Internship not found.",
        success:false
    });
            }

            return res.status(200).json({job, success:true});

            } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message, success: false });
        }
        };

        // recruiter - get all internships created
    export const getAdminJobs = async (req,res) => {
        try{
            const adminId = req.id;
            const jobs = await Job.find({created_by:adminId}).populate({
                path:'company'
            }).sort({ createdAt: -1 });
            
            if(!jobs){
                return res.status(404).json({
                    message:"Inetrnships not found.",
                    success:false
                });
            }
            return res.status(200).json({
                jobs,
                success:true
            })
        } catch(error) {
            console.log(error);
             return res.status(500).json({ message: error.message, success: false });
    }
        };
    
// recommendation based 

        export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skills = user.profile?.skills || [];

    // If no skills
    if (skills.length === 0) {
      return res.json([]);
    }

    const jobs = await Job.find({
      requirements: { $in: skills }
    });

    // Rank jobs by matching skills
    const rankedJobs = jobs
      .map(job => {
        const matchCount = job.requirements.filter(skill =>
          skills.includes(skill)
        ).length;

        return {
          ...job.toObject(),
          matchedSkillsCount: matchCount
        };
      })
      .sort((a, b) => b.matchedSkillsCount - a.matchedSkillsCount);

    res.json(rankedJobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};