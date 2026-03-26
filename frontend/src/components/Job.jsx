import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bookmark, Share2 } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleSave = () => {
    setSaved(!saved);
    // Later: dispatch Redux action or call API to persist
  };

  const handleShare = async () => {
    const shareData = {
      title: job?.title,
      text: `Check out this internship: ${job?.title} at ${job?.company?.name || job?.Company?.Name}`,
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

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? 'Today'
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          onClick={handleSave}
          variant={saved ? 'default' : 'outline'}
          className={`rounded-full p-2 ${saved ? 'bg-green-600 text-white' : ''}`}
        >
          <Bookmark size={16} />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg">{job?.company?.name || job?.Company?.Name}</h1>
          <p className="text-sm text-gray-500">Nepal</p>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-4">
        <h1 className="font-bold text-xl mb-1">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          Internship
        </Badge>
        <Badge className="text-red-600 font-bold" variant="ghost">
          Stipend: {job?.stipend || job?.salary || 'Unpaid'}
        </Badge>
        <Badge className="text-purple-700 font-bold" variant="ghost">
          Duration: {job?.duration || job?.position}
        </Badge>
        <Badge className="text-green-700 font-bold" variant="ghost">
          Eligibility: {job?.eligibility || 'Students'}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mt-auto">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="flex-1"
        >
          Details
        </Button>
        <Button
          onClick={handleSave}
          className={`flex-1 ${saved ? 'bg-green-600 text-white' : 'bg-[#7209b7] text-white'}`}
        >
          {saved ? 'Saved' : 'Favorite'}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share2 size={16} /> Share
        </Button>
      </div>
    </div>
  );
};

export default JobCard;