import { setAllAdminJobs} from '@/redux/jobSlice';
import{JOB_API_END_POINT} from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import  { useEffect } from 'react';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const fetchAllAdminJobs = async () => {
        try{
            const res = await axios .get(`${JOB_API_END_POINT}/admin`,{withCredentials:true});
            if(res.data.success){
                dispatch(setAllAdminJobs(res.data.jobs));
            }
        }catch (error){
            console.log(error);  
        }
    };
    useEffect(()=> {
    fetchAllAdminJobs();
  },[]);
  return {fetchAllAdminJobs};
};

export default useGetAllAdminJobs;
