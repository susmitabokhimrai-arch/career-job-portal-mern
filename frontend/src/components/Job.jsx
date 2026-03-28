import React from 'react';
import { Button } from './ui/button';
import { Bookmark, Share2, MapPin } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/redux/authslice';
import { USER_API_END_POINT } from '@/utils/constant';


const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  // Check if job is already saved
  const isSaved = user?.savedJobs?.some(
    id => id.toString() === job._id?.toString()
  );

  // Calculate how many days ago the job was posted
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Save or unsave job
  const handleSave = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/user/save/${job._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUser(res.data.user));
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  // Share job link
  const handleShare = async () => {
    const shareData = {
      title: job?.title,
      text: `Check out this internship: ${job?.title}`,
      url: `${window.location.origin}/description/${job?._id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isNew = daysAgoFunction(job?.createdAt) <= 2;

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 flex flex-col">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-gray-500">
            {daysAgoFunction(job?.createdAt) === 0
              ? 'Today'
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </p>
          {isNew && <Badge className="bg-red-100 text-red-600 text-xs">🔥 New</Badge>}
        </div>
        <Button
          onClick={handleSave}
          variant="outline"
          className={`rounded-full p-2 ${isSaved ? 'bg-green-600 text-white' : ''}`}
        >
          <Bookmark size={16} />
        </Button>
      </div>

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

      {/* Job Title & Description */}
      <div className="mb-3">
        <h1 className="font-bold text-lg leading-snug">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{job?.description}</p>
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-blue-100 text-blue-700 text-xs">Internship</Badge>
        <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
          💰 {job?.stipend || job?.salary || 'Unpaid'}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 text-xs">
          ⏳ {job?.duration || '3 Months'}
        </Badge>
        <Badge className="bg-yellow-100 text-yellow-700 text-xs">🎓 Students</Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mt-auto">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="flex-1"
        >
          View
        </Button>
        <Button
          onClick={handleSave}
          className={`flex-1 ${isSaved ? 'bg-green-600 text-white' : 'bg-[#7209b7] text-white'}`}
        >
          {isSaved ? 'Saved' : 'Favorite'}
        </Button>
        <Button onClick={handleShare} variant="outline" className="px-3">
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;