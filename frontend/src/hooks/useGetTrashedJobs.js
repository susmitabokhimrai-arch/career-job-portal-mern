import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTrashedJobs } from "@/redux/jobSlice";
import { toast } from "sonner";

const useGetTrashedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTrashedJobs = async () => {
      try {
        const res = await axios.get("/api/v1/job/trash", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setTrashedJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch trashed jobs");
      }
    };
    fetchTrashedJobs();
  }, [dispatch]);
};

export default useGetTrashedJobs;