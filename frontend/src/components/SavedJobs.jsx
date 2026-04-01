import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constant';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { MapPin, Bookmark } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authslice';
import Navbar from './shared/Navbar';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  // Fetch saved jobs from backend
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(
          `${USER_API_END_POINT}/saved`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    useEffect
    fetchSavedJobs();
  }, []);

  // Unsave a job directly from this page
  const handleUnsave = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.user) {
        dispatch(setUser(res.data.user));
        // Remove from local list instantly
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-sm">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div>
            <Navbar/>
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">
          {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
        </p>
      </div>

      {/* Empty state */}
      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Bookmark size={40} className="text-gray-300" />
          <p className="text-gray-500 font-medium">No saved jobs yet</p>
          <p className="text-gray-400 text-sm">Click the Favourite button on any job to save it here</p>
          <Button
            onClick={() => navigate('/jobs')}
            className="mt-2 bg-[#7209b7] text-white"
          >
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map(job => (
            <div
              key={job._id}
              className="p-5 rounded-md shadow-xl bg-white border border-gray-100 flex flex-col"
            >
              {/* Company */}
              <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={job?.company?.logo} />
                      </Avatar>
                      <div>
                  <h1 className="font-semibold text-base">{job?.company?.name}</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {job?.location || 'Remote'}
                  </p>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-3">
                <h1 className="font-bold text-lg leading-snug">{job?.title}</h1>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{job?.description}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-700 text-xs">Internship</Badge>
                <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
                  💰 {job?.stipend || job?.salary || 'Unpaid'}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  ⏳ {job?.duration || '3 Months'}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <Button
                  onClick={() => navigate(`/description/${job._id}`)}
                  variant="outline"
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  onClick={() => handleUnsave(job._id)}
                  className="flex-1 bg-green-600 hover:bg-red-500 text-white transition-colors duration-200"
                >
                  ✓ Saved
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SavedJobs;