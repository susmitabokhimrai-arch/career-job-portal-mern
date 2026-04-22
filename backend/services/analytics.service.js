import  { User } from "../models/user.model.js";
import  {Job} from "../models/job.model.js";
import  { Application } from "../models/application.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  return {
    totalUsers,
    totalJobs,
    totalApplications
  };
};