import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2  } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DeleteCompanyModal from './DeleteCompanyModal' 
import useSoftDeleteJob from '@/hooks/useSoftDeleteJob' 

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    // State for delete modal
    const softDeleteJob = useSoftDeleteJob();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    
    useEffect(() => {
        const filteredJobs = (allAdminJobs || []).filter((job) => {
            if (!searchJobByText) {
                return true
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText])

    // Handle delete click 
    const handleDeleteClick = (job) => {
        const dontAsk = localStorage.getItem('dontAskDeleteConfirmation') === 'true';
        
        if (dontAsk) {
            softDeleteJob(job._id);
        } else {
            setJobToDelete(job);
            setShowDeleteModal(true);
        }
    }

    // Handle confirm delet 
    const handleConfirmDelete = async () => {
        if (jobToDelete) {
            await softDeleteJob(jobToDelete._id);
        }
        setShowDeleteModal(false);
        setJobToDelete(null);
    }
    // Handle cancel delete 
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setJobToDelete(null);
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <TableCaption className="text-center text-blue-500 text-sm pb-4">A list of your recent posted jobs</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Company Name</TableHead>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Role</TableHead>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Date</TableHead>
                        <TableHead className="text-right text-gray-700 font-medium px-4 py-2">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <tr key={job._id}className="hover:bg-gray-50 transition duration-200">
                                <TableCell className="px-4 py-3">{job?.company?.name}</TableCell>
                                <TableCell className="px-4 py-3">{job?.title}</TableCell>
                                <TableCell className="px-4 py-3">{job?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                        <div className="p-2 hover:bg-gray-100 rounded-full inline-flex">
                                           <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                            </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 bg-white shadow-lg rounded-md p-2">
                                            <div onClick={() => navigate(`/admin/jobs/${job._id}`)} className='flex items-center gap-2 w-full cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md transition'>
                                                <Edit2 className='w-4 h-4 text-gray-600' />
                                                <span className="text-gray-700 text-sm">Edit</span>
                                            </div>
                                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center gap-2 w-full cursor-pointerpx-2 py-1 mt-1 hover:bg-gray-100 rounded-md transition' >
                                                <Eye className='w-4 h-4 text-gray-600'/>
                                                <span className="text-gray-700 text-sm">Applicants</span>
                                            </div>
                                            {/* Delete button */}
                                            <div onClick={() => handleDeleteClick(job)} className='flex items-center gap-2 w-full cursor-pointer px-2 py-1 mt-1 hover:bg-red-50 rounded-md transition'>
                                                <Trash2 className='w-4 h-4 text-red-500' />
                                                <span className="text-red-500 text-sm">Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>

                            </tr>

                        ))
                    }
                </TableBody>
            </Table>
            {/* Delete Confirmation Modal (reused from companies) */}
            {showDeleteModal && jobToDelete && (
                <DeleteCompanyModal
                    company={jobToDelete}  // Pass job as company (modal uses company?.name)
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}

export default AdminJobsTable
