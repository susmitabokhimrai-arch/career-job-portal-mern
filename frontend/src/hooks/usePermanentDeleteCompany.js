import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { permanentDeleteCompanyReducer } from '@/redux/companySlice';

const usePermanentDeleteCompany = () => {
    const dispatch = useDispatch();

    const permanentDeleteCompanyById = async (companyId) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/permanent-delete/${companyId}`, { 
                withCredentials: true 
            });
            
            if(res.data.success){
                dispatch(permanentDeleteCompanyReducer(companyId));
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: error.response?.data?.message || "Failed to permanently delete company" };
        }
    }

    return permanentDeleteCompanyById;
}

export default usePermanentDeleteCompany;