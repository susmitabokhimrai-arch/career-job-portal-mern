import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { permanentDeleteJobReducer } from "@/redux/jobSlice";

const usePermanentDeleteJob = () => {
  const dispatch = useDispatch();

  const permanentDeleteJobById = async (jobId) => {
    try {
      const res = await axios.delete(
        `/api/v1/job/permanent-delete/${jobId}`,
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
        dispatch(permanentDeleteJobReducer(jobId));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to permanently delete job");
      return false;
    }
  };

  return permanentDeleteJobById;
};

export default usePermanentDeleteJob;