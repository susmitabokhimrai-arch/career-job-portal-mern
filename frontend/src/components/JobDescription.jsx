import React, { useEffect , useState} from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import{APPLICATION_API_END_POINT, JOB_API_END_POINT} from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store=>store.job);
    const{User} = useSelector(store=>store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === User?._id) || false;
   
    const params = useParams();
   const[isApplied, setIsApplied] = useState(isInitiallyApplied);
    const jobid = params.id;
    
    
    const dispatch = useDispatch();
    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobid}`, { withCredentials: true });
           // console.log(res.data);
            if (res.data.success) {
                setIsApplied(true);//update local state to reflect the applied status immediately
                const updatedSingleJob = {...singleJob,applications:[...singleJob.applications,{applicant:User?._id}]};
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);}
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error applying for job");
            console.error("Error applying for job:", error);
        }
    };

    useEffect(()=>{
    const fetchSingleJob = async () => {
        try{
           const res = await axios .get(`${JOB_API_END_POINT}/get/${jobid}`,{withCredentials:true});
            if(res.data.success){
                dispatch(setSingleJob(res.data.job));
                setIsApplied(res.data.job.applications.some(application => application.applicant === User?._id));//ensure the state is in sync with fetched data
            }else{
                console.log("API returned success: false",res.data); 
                
            }
        }catch (error){
            console.error("error fetching jobs:",error);
        }
    }
    fetchSingleJob();
  },[jobid,dispatch, User?._id]);
    return (
        <div className='min-h-screen bg-gray-50 py-10 px-4'>
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                    {/* LEFT SIDE */}
                    <div>
                        <h1 className="text-3xl font-bold mb-3 text-gray-800">{singleJob?.title}</h1>

                        <div className="flex flex-wrap gap-3">
                            <Badge className="bg-blue-50 text-blue-600">{singleJob?.position} Positions</Badge>
                            <Badge className="bg-red-50 text-red-600">{singleJob?.jobType}</Badge>
                            <Badge className="bg-purple-50 text-purple-600">{singleJob?.salary} LPA</Badge>
                        </div>
                    </div>

                    {/* RIGHT SIDE BUTTON */}
                    <Button
                    className={`rounded-lg px-4 py-2 ${isApplied
                            ? "bg-gray-600 opacity-70 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                >
                        {isApplied ? "Already Applied" : "Apply Now"}
                    </Button>
                </div>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Role:<span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location:<span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description:<span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience:<span className='pl-4 font-normal text-gray-800'>{singleJob?.experience}</span></h1>
                    <h1 className='font-bold my-1'>Salary:<span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicant:<span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date:<span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt ? singleJob.createdAt.split("T")[0]:"N/A"}</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
