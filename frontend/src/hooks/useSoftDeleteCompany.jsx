import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setCompanies } from "@/redux/companySlice";

const useSoftDeleteCompany = () => {
  const dispatch = useDispatch();

  const softDeleteCompany = async (companyId) => {
    try {
const res = await axios.delete(  
            `/api/v1/company/soft-delete/${companyId}`,
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
        // Refresh companies list
        const updatedCompanies = await axios.get("/api/v1/company/get", {
          withCredentials: true,
        });
        dispatch(setCompanies(updatedCompanies.data.companies));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete company");
      return false;
    }
  };

  return softDeleteCompany;
};

export default useSoftDeleteCompany;