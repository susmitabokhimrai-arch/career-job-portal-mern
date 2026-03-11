import{COMPANY_API_END_POINT} from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import  { useEffect } from 'react';
import { setSingleCompany } from '@/redux/companySlice';


const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
  useEffect(()=>{
    const fetchSingleCompany = async () => {
        try{
            const res = await axios .get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
            console.log(res.data.company);
            if(res.data.success){
                dispatch(setSingleCompany(res.data.company));
            }else{
                console.log("API returned success: false",res.data);
            }
        }catch (error){
            console.error("error fetching jobs:",error);
        }
    }
    fetchSingleCompany();
  },[companyId, dispatch])
}

export default useGetCompanyById
