import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Trash2, X, Briefcase, CheckCircle, Clock, XCircle, FilterX  } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { deleteApplication } from '@/redux/jobSlice';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  // State for showing/hiding delete confirmation popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // State to store which job user wants to delete
  const [jobToDelete, setJobToDelete] = useState(null);
  // loading state for delete button
  const [isDeleting, setIsDeleting] = useState(false);
// State for filtering jobs by status (null = show all)
  const [activeFilter, setActiveFilter] = useState(null);

  // Calculate statistics from applied jobs
  const calculateStats = () => {
    const total = allAppliedJobs.length;
    const applied = allAppliedJobs.filter(job => job?.status === 'applied').length;
    const interview = allAppliedJobs.filter(job => job?.status === 'interview').length;
    const shortlisted = allAppliedJobs.filter(job => job?.status === 'shortlisted').length;
    const selected = allAppliedJobs.filter(job => job?.status === 'selected').length;
    const rejected = allAppliedJobs.filter(job => job?.status === 'rejected').length;
    
    return { total, applied, interview, shortlisted, selected, rejected };
  };
  
  const stats = calculateStats();
  // Filter jobs based on active filter
  const getFilteredJobs = () => {
    if (!activeFilter) {
      return allAppliedJobs;
    }
    return allAppliedJobs.filter(job => job?.status === activeFilter);
  };
  const filteredJobs = getFilteredJobs();
  // Handle filter click - shows jobs with selected status
  const handleFilterClick = (status) => {
    if (activeFilter === status) {
      setActiveFilter(null); // Clear filter if clicking the same one
    } else {
      setActiveFilter(status); // Set new filter
    }
  };
  
  // Clear all filters
  const clearFilter = () => {
    setActiveFilter(null);
  };

  // Function to handle click on delete button - shows popup
  const handleDeleteClick = (appliedJob) => {
    setJobToDelete(appliedJob);
    setShowDeletePopup(true);
  };

  // confirmDelete function with actual API call
  const confirmDelete = async () => {
    if (!jobToDelete) return;

    // Start loading state
    setIsDeleting(true);
    try {
      // Dispatch the deleteApplication action
      const resultAction = await dispatch(deleteApplication(jobToDelete._id));

      // Check if the delete was successful
      if (deleteApplication.fulfilled.match(resultAction)) {
        // Show success message with job title and company
        toast.success(
          `Deleted: ${jobToDelete.job?.title || 'Job'} at ${jobToDelete.job?.company?.name || 'Company'}`
        );
      } else {
        // Show error message if delete failed
        toast.error(resultAction.payload || 'Failed to delete application');
      }
    } catch (error) {
      // Handle any unexpected errors
      toast.error('Something went wrong. Please try again.');
      console.error('Delete error:', error);
    } finally {
      // Close popup and clear state regardless of success/failure
      setIsDeleting(false);
      setShowDeletePopup(false);
      setJobToDelete(null);
    }
  };
  // Function to cancel delete - just closes popup
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setJobToDelete(null);
  };

  return (
    <>
    {/* Stats Cards - Total Applied Jobs Summary */}
      {allAppliedJobs.length > 0 && (
        <div className="mb-6">
          {/* Main Total Card - Click to clear filter */}
          <div 
            onClick={clearFilter}
            className={`bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-4 shadow-lg cursor-pointer transition-transform hover:scale-[1.02] ${activeFilter === null ? 'ring-4 ring-purple-300' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-purple-100 text-sm font-medium mb-1">Total Applications</p>
                <p className="text-5xl font-bold">{stats.total}</p>
                <p className="text-purple-100 text-sm mt-2">Jobs applied so far</p>
                {activeFilter && (
                  <p className="text-purple-100 text-xs mt-1 flex items-center gap-1">
                    <FilterX className="w-3 h-3" /> Click to clear filter
                  </p>
                )}
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Status Breakdown Cards - Click to filter */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Applied Card */}
            <div 
              onClick={() => handleFilterClick('applied')}
              className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] ${
                activeFilter === 'applied' 
                  ? 'bg-gray-200 border-gray-400 ring-2 ring-gray-500' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className={`w-4 h-4 ${activeFilter === 'applied' ? 'text-gray-700' : 'text-gray-500'}`} />
                <span className={`text-xs ${activeFilter === 'applied' ? 'text-gray-700 font-semibold' : 'text-gray-500'}`}>Applied</span>
              </div>
              <p className={`text-2xl font-bold ${activeFilter === 'applied' ? 'text-gray-900' : 'text-gray-800'}`}>{stats.applied}</p>
            </div>
            {/* Interview Card */}
            <div 
              onClick={() => handleFilterClick('interview')}
              className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] ${
                activeFilter === 'interview' 
                  ? 'bg-blue-200 border-blue-400 ring-2 ring-blue-500' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`w-4 h-4 ${activeFilter === 'interview' ? 'text-blue-700' : 'text-blue-500'}`} />
                <span className={`text-xs ${activeFilter === 'interview' ? 'text-blue-700 font-semibold' : 'text-blue-600'}`}>Interview</span>
              </div>
              <p className={`text-2xl font-bold ${activeFilter === 'interview' ? 'text-blue-800' : 'text-blue-700'}`}>{stats.interview}</p>
            </div>
{/* Shortlisted Card */}
            <div 
              onClick={() => handleFilterClick('shortlisted')}
              className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] ${
                activeFilter === 'shortlisted' 
                  ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-500' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`w-4 h-4 ${activeFilter === 'shortlisted' ? 'text-yellow-700' : 'text-yellow-500'}`} />
                <span className={`text-xs ${activeFilter === 'shortlisted' ? 'text-yellow-700 font-semibold' : 'text-yellow-600'}`}>Shortlisted</span>
              </div>
              <p className={`text-2xl font-bold ${activeFilter === 'shortlisted' ? 'text-yellow-800' : 'text-yellow-700'}`}>{stats.shortlisted}</p>
            </div>

            {/* Selected Card */}
            <div 
              onClick={() => handleFilterClick('selected')}
              className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] ${
                activeFilter === 'selected' 
                  ? 'bg-green-200 border-green-400 ring-2 ring-green-500' 
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className={`w-4 h-4 ${activeFilter === 'selected' ? 'text-green-700' : 'text-green-500'}`} />
                <span className={`text-xs ${activeFilter === 'selected' ? 'text-green-700 font-semibold' : 'text-green-600'}`}>Selected</span>
              </div>
              <p className={`text-2xl font-bold ${activeFilter === 'selected' ? 'text-green-800' : 'text-green-700'}`}>{stats.selected}</p>
            </div>
             {/* Rejected Card */}
            <div 
              onClick={() => handleFilterClick('rejected')}
              className={`rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] ${
                activeFilter === 'rejected' 
                  ? 'bg-red-200 border-red-400 ring-2 ring-red-500' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <XCircle className={`w-4 h-4 ${activeFilter === 'rejected' ? 'text-red-700' : 'text-red-500'}`} />
                <span className={`text-xs ${activeFilter === 'rejected' ? 'text-red-700 font-semibold' : 'text-red-600'}`}>Rejected</span>
              </div>
              <p className={`text-2xl font-bold ${activeFilter === 'rejected' ? 'text-red-800' : 'text-red-700'}`}>{stats.rejected}</p>
            </div>
          </div>

          {/* Active Filter Info Bar */}
          {activeFilter && (
            <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <FilterX className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Showing: <span className="font-semibold capitalize">{activeFilter}</span> jobs 
                  <span className="text-gray-500 ml-1">({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'})</span>
                </span>
              </div>
              <button
                onClick={clearFilter}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filter
              </button>
            </div>
          )}
          </div>
      )}

      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableCaption className="text-gray-500 text-sm">
            Track the status of your job applications
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Job Role</TableHead>
              <TableHead className="font-semibold text-gray-700">Company</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length <= 0 ? (
              <TableRow>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  {activeFilter 
                    ? `No jobs found with status "${activeFilter}".` 
                    : "You haven't applied to any job yet."}
                </td>
              </TableRow>
            ) : (
             filteredJobs.map((appliedJob) => (
                <TableRow
                  key={appliedJob._id}
                  className="hover:bg-gray-50 transition-colors rounded-md"
                >
                  <TableCell className="py-2">{appliedJob?.createdAt?.split('T')[0]}</TableCell>
                  <TableCell className="py-2">{appliedJob.job?.title}</TableCell>
                  <TableCell className="py-2">{appliedJob.job?.company?.name}</TableCell>
                  <TableCell className="text-right py-2">
                    <Badge
                       className={`px-3 py-1 rounded-full text-white text-sm 
                      ${appliedJob?.status === 'rejected' ? 'bg-red-500' : ''} 
                      ${appliedJob?.status === 'applied' ? 'bg-gray-500' : ''} 
                      ${appliedJob?.status === 'shortlisted' ? 'bg-yellow-500' : ''} 
                      ${appliedJob?.status === 'interview' ? 'bg-blue-500' : ''} 
                      ${appliedJob?.status === 'selected' ? 'bg-green-500' : ''}`}
                    >
                      {appliedJob?.status.toUpperCase()}
                    </Badge>
                    </TableCell>
                  {/* Delete button */}
                  <TableCell className="text-center py-2">
                    <button
                      onClick={() => handleDeleteClick(appliedJob)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Confirmation Popup Modal */}
      {showDeletePopup && jobToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Popup Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <button
                onClick={cancelDelete}
                disabled={isDeleting} // Disable close button while deleting
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popup Body */}
            <div className="p-5">
              <p className="text-gray-700 text-center">
                Delete application for
              </p>
              <p className="font-semibold text-gray-900 text-center text-lg mt-1">
                "{jobToDelete.job?.title || 'Job'}" at "{jobToDelete.job?.company?.name || 'Company'}"?
              </p>

              {/* Cancel and Delete buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting} // Disable cancel button while deleting
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting} //  Disable cancel button while processing
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    // Show loading spinner while deleting
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppliedJobTable;