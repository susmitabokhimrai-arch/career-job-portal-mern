import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bookmark, Share2, MapPin } from 'lucide-react';
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
  };

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isNew = daysAgoFunction(job?.createdAt) <= 2;

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>

      {/* Top Row */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-gray-500">
            {daysAgoFunction(job?.createdAt) === 0
              ? 'Today'
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </p>

          {isNew && (
            <Badge className="bg-red-100 text-red-600 text-xs">🔥 New</Badge>
          )}
        </div>

        <Button
          onClick={handleSave}
          variant="outline"
          className={`rounded-full p-2 ${saved ? 'bg-green-600 text-white' : ''}`}
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
          <h1 className="font-semibold text-base">
            {job?.company?.name || job?.Company?.Name}
          </h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {job?.location || 'Remote'}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h1 className="font-bold text-lg leading-snug">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {job?.description}
        </p>
      </div>

      {/* Internship Highlights */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-blue-100 text-blue-700 text-xs">
          Internship
        </Badge>

        <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
          💰 {job?.stipend || job?.salary || 'Unpaid'}
        </Badge>

        <Badge className="bg-purple-100 text-purple-700 text-xs">
          ⏳ {job?.duration || '3 Months'}
        </Badge>

        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
          🎓 Students
        </Badge>
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
          className={`flex-1 ${saved ? 'bg-green-600 text-white' : 'bg-[#7209b7] text-white'}`}
        >
          {saved ? 'Saved' : 'Favorite'}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="px-3"
        >
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;