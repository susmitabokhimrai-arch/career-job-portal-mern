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
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
    const fetchSingleJob = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/${jobId}`, { withCredentials: true });
            if(res.data.success){
                dispatch(setSingleJob(res.data.job));
                setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
            }
        } catch (error) {
            console.error('Failed to fetch job:', error.response?.data || error.message);
            toast.error("Job not found or server error");
        }
    }
    fetchSingleJob(); 
}, [jobId, dispatch, user?._id]);
    return (
        <div className='min-h-screen bg-gray-50 py-10 px-4'>
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                    
                    <div>
                        <h1 className="text-3xl font-bold mb-3 text-gray-800">{singleJob?.title}</h1>

                        <div className="flex flex-wrap gap-3">
                            <Badge className="bg-blue-50 text-blue-600">{singleJob?.position} Positions</Badge>
                            <Badge className="bg-red-50 text-red-600">📍{singleJob?.internshipType}</Badge>
                            <Badge className="bg-purple-50 text-purple-600">💰{singleJob?.stipend || 'Unpaid'}</Badge>
                            <Badge className="bg-purple-50 text-purple-600">⏳{singleJob?.duration}</Badge>

                        </div>
                    </div>

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
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Internship Details</h1>
                <div className='my-4'>
                    <p><b>Role:</b> {singleJob?.title}</p>

                    <p><b>Location:</b> {singleJob?.location}</p>

                    <p><b>Description:</b> {singleJob?.description}</p>

                    <p><b>Start Date:</b> {singleJob?.startDate ? new Date(singleJob.startDate).toLocaleDateString() : "N/A"}</p>

                    <p><b>Apply Before:</b> {singleJob?.applicationDeadline ? new Date(singleJob.applicationDeadline).toLocaleDateString() : "N/A"}</p>

                    <p><b>Total Applicants:</b> {singleJob?.applications?.length}</p>

                    <p><b>Posted Date:</b> {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "N/A"}</p>

                    <div>
                        <b>Skills Required:</b>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {singleJob?.skillsRequired?.map((skill, index) => (
                                <Badge key={index} className="bg-yellow-100 text-yellow-700">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <b>Perks:</b>
                        <ul className="list-disc ml-6 mt-1">
                            {singleJob?.perks?.map((perk, index) => (
                                <li key={index}>{perk}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default JobDescription;
