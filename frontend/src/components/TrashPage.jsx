import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarImage } from './ui/avatar';
import { Trash2, RotateCcw, AlertTriangle, Building, Briefcase } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './shared/Navbar';
import { toast } from 'sonner';
import axios from 'axios';
import { setTrashedCompanies, restoreCompanyReducer, permanentDeleteCompanyReducer } from '@/redux/companySlice';
import { setTrashedJobs, restoreJobReducer, permanentDeleteJobReducer } from '@/redux/jobSlice';

const TrashPage = () => {
    const dispatch = useDispatch();
    // Fetch trashed companies when page loads
    const { trashedCompanies } = useSelector(store => store.company);
    const { trashedJobs } = useSelector(store => store.job);

    // State for confirmation dialog
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);

    // Fetch trashed companies 
    useEffect(() => {
        const fetchTrashedCompanies = async () => {
            try {
                const res = await axios.get('/api/v1/company/trash', { withCredentials: true });
                if (res.data.success) {
                    dispatch(setTrashedCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchTrashedCompanies();
    }, [dispatch]);

    // Fetch trashed jobs 
    useEffect(() => {
        const fetchTrashedJobs = async () => {
            try {
                const res = await axios.get('/api/v1/job/trash', { withCredentials: true });
                if (res.data.success) {
                    dispatch(setTrashedJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchTrashedJobs();
    }, [dispatch]);


    // Handle restore for both companies and jobs
    const handleRestore = async (item, type) => {
        try {
            const endpoint = type === 'company'
                ? `/api/v1/company/restore/${item._id}`
                : `/api/v1/job/restore/${item._id}`;

            const res = await axios.put(endpoint, {}, { withCredentials: true });

            if (res.data.success) {
                if (type === 'company') {
                    dispatch(restoreCompanyReducer(item._id));
                } else {
                    dispatch(restoreJobReducer(item._id));
                }
                toast.success(`${type === 'company' ? 'Company' : 'Job'} restored successfully!`);
            }
        } catch (error) {
            toast.error(`Failed to restore ${type}`);
        }
    };

    // Handle permanent delete for both companies and jobs 
    const handlePermanentDelete = async (item, type) => {
        try {
            const endpoint = type === 'company'
                ? `/api/v1/company/permanent-delete/${item._id}`
                : `/api/v1/job/permanent-delete/${item._id}`;

            const res = await axios.delete(endpoint, { withCredentials: true });

            if (res.data.success) {
                if (type === 'company') {
                    dispatch(permanentDeleteCompanyReducer(item._id));
                } else {
                    dispatch(permanentDeleteJobReducer(item._id));
                }
                setConfirmDeleteId(null);
                setDeleteType(null);
                toast.success(`${type === 'company' ? 'Company' : 'Job'} permanently deleted!`);
            }
        } catch (error) {
            toast.error(`Failed to permanently delete ${type}`);
        }
    };
    // Separate Companies Table Component 
    const CompaniesTable = () => {
        if (!trashedCompanies?.length) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No companies in trash</p>
                </div>
            );
        }

        return (
            <Table>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="px-4 py-2">Logo</TableHead>
                        <TableHead className="px-4 py-2">Name</TableHead>
                        <TableHead className="px-4 py-2">Deleted Date</TableHead>
                        <TableHead className="px-4 py-2 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trashedCompanies.map((company) => (
                        <TableRow key={`company-${company._id}`} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={company.logo} />
                                </Avatar>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-700 font-medium">
                                {company.name}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500">
                                {company.deletedAt ? new Date(company.deletedAt).toLocaleDateString() : 'Unknown'}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleRestore(company, 'company')}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Restore
                                    </button>
                                    {confirmDeleteId === company._id && deleteType === 'company' ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handlePermanentDelete(company, 'company')}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setConfirmDeleteId(null);
                                                    setDeleteType(null);
                                                }}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setConfirmDeleteId(company._id);
                                                setDeleteType('company');
                                            }}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Delete Permanently
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };
    // Separate Jobs Table Component 
    const JobsTable = () => {
        if (!trashedJobs?.length) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No jobs in trash</p>
                </div>
            );
        }
        return (
            <Table>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="px-4 py-2">Company Name</TableHead>
                        <TableHead className="px-4 py-2">Role</TableHead>
                        <TableHead className="px-4 py-2">Deleted Date</TableHead>
                        <TableHead className="px-4 py-2 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trashedJobs.map((job) => (
                        <TableRow key={`job-${job._id}`} className="hover:bg-gray-50">
                            <TableCell className="px-4 py-3 text-gray-700 font-medium">
                                {job.company?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-600">
                                {job.title}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500">
                                {job.deletedAt ? new Date(job.deletedAt).toLocaleDateString() : 'Unknown'}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleRestore(job, 'job')}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Restore
                                    </button>

                                    {confirmDeleteId === job._id && deleteType === 'job' ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handlePermanentDelete(job, 'job')}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setConfirmDeleteId(null);
                                                    setDeleteType(null);
                                                }}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setConfirmDeleteId(job._id);
                                                setDeleteType('job');
                                            }}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Delete Permanently
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            Trash
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Companies and Jobs moved to trash can be restored or permanently deleted
                        </p>
                    </div>
                    {/* COMPANIES SECTION - SEPARATE */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-200">
                            <Building className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Companies in Trash</h2>
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                {trashedCompanies?.length || 0}
                            </span>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <CompaniesTable />
                        </div>
                    </div>
                    {/*  JOBS SECTION - SEPARATE */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-green-200">
                            <Briefcase className="w-5 h-5 text-green-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Jobs in Trash</h2>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                {trashedJobs?.length || 0}
                            </span>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <JobsTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrashPage;

