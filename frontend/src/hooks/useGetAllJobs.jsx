import { setAllJobs } from '@/redux/jobSlice';
import{JOB_API_END_POINT} from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import  { useEffect } from 'react';


const useGetAllJobs = () => {
    const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllJobs = async () => {
        try{
            const res = await axios .get(`${JOB_API_END_POINT}/get`,{withCredentials:true});
            if(res.data.success){
                dispatchEvent(setAllJobs(res.data.jobs));
            }else{
                console.log("API returned succes: false",res.data);
            }
        }catch (error){
            console.error("error fetching jobs:",error);
        }
    }
    fetchAllJobs();
  },[dispatch])
}

export default useGetAllJobs
