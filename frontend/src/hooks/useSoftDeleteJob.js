import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllAdminJobs, softDeleteJobReducer } from "@/redux/jobSlice";

const useSoftDeleteJob = () => {
  const dispatch = useDispatch();

  const softDeleteJobById = async (jobId) => {
    try {
      const res = await axios.delete(
        `/api/v1/job/soft-delete/${jobId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Remove job from Redux state
        dispatch(softDeleteJobReducer(jobId));
        
        // Refresh admin jobs list
        const updatedJobs = await axios.get("/api/v1/job/admin", {
          withCredentials: true,
        });
        dispatch(setAllAdminJobs(updatedJobs.data.jobs));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move job to trash");
      return false;
    }
  };

  return softDeleteJobById;
};

export default useSoftDeleteJob;