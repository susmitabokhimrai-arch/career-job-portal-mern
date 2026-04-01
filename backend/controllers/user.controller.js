import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";

// register
export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({ message: `Welcome back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let cloudResponse;
    
    if (file) {
      // check if file is PDF
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ 
          message: "Only PDF files are allowed. Please upload a PDF document.", 
          success: false 
        });
      }
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        return res.status(400).json({ 
          message: `File size must be less than 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`, 
          success: false 
        });
      }

      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
        folder: "resumes",
        type: "upload",
      });
    }

    let skillsArray;
    if (skills) skillsArray = skills.split(",");

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    const responseUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: responseUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// toggle save job
export const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const jobId = req.params.id;
    const alreadySaved = user.savedJobs.some(id => id.toString() === jobId.toString());

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId.toString());
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs,
    };

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// get saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "savedJobs",
      populate: { path: "company" },
    });

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    return res.status(200).json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// get recommended jobs based on user's skills
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    if (!user.profile.skills || user.profile.skills.length === 0) {
      return res.status(400).json({ 
        message: "No skills found for recommendation.", 
        success: false 
      });
    }

    const recommendedJobs = await Job.find({
      requiredSkills: { $in: user.profile.skills }
    }).populate("company").limit(10);

    return res.status(200).json({ 
      success: true, 
      jobs: recommendedJobs 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Failed to fetch recommended jobs.", 
      success: false 
    });
  }
};

// get resume - view or download
export const getResume = async (req, res) => {
  try {
    console.log("=== getResume called ===");

    const targetUserId = req.params.id;
    const loggedInUserId = req.id;
    const userIdToFetch = targetUserId || loggedInUserId;
    const action = req.query.action || 'view';

    const targetUser = await User.findById(userIdToFetch);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!targetUser.profile || !targetUser.profile.resume) {
      return res.status(404).json({ 
        message: "Resume not found. Please upload a resume first.", 
        success: false 
      });
    }

    const resumeUrl = targetUser.profile.resume;
    const fileName = targetUser.profile.resumeOriginalName || 'resume.pdf';

    if (targetUserId && targetUserId !== loggedInUserId) {
      const loggedInUser = await User.findById(loggedInUserId);
      if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'hr')) {
        return res.status(401).json({ 
          message: "Unauthorized to view this resume", 
          success: false 
        });
      }
    }

    if (action === 'download') return res.redirect(resumeUrl);

    try {
      const response = await fetch(resumeUrl);
      const pdfBuffer = await response.arrayBuffer();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.byteLength);

      return res.send(Buffer.from(pdfBuffer));
    } catch (pdfError) {
      console.error("Error fetching PDF:", pdfError);
      return res.redirect(resumeUrl);
    }

  } catch (error) {
    console.error("Error in getResume:", error);
    return res.status(500).json({
      message: "Server error while fetching resume",
      success: false,
      error: error.message,
    });
  }
};