import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { restoreCompanyReducer } from '@/redux/companySlice';

const useRestoreCompany = () => {
    const dispatch = useDispatch();

    const restoreCompanyById = async (companyId) => {
        try {
            const res = await axios.put(`${COMPANY_API_END_POINT}/restore/${companyId}`, {}, { 
                withCredentials: true 
            });
            
            if(res.data.success){
                dispatch(restoreCompanyReducer(companyId));
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: error.response?.data?.message || "Failed to restore company" };
        }
    }

    return restoreCompanyById;
}

export default useRestoreCompany;