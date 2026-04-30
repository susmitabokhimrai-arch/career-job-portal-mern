import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { restoreJobReducer, setAllAdminJobs } from "@/redux/jobSlice";

const useRestoreJob = () => {
  const dispatch = useDispatch();

  const restoreJobById = async (jobId) => {
    try {
      const res = await axios.put(
        `/api/v1/job/restore/${jobId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // Remove from trash in Redux state
        dispatch(restoreJobReducer(jobId));
        
        // Refresh admin jobs list
        const updatedJobs = await axios.get("/api/v1/job/admin", {
          withCredentials: true,
        });
        dispatch(setAllAdminJobs(updatedJobs.data.jobs));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore job");
      return false;
    }
  };

  return restoreJobById;
};

export default useRestoreJob;