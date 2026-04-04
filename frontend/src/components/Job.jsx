import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, Share2, MapPin } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/authslice";
import { USER_API_END_POINT } from "@/utils/constant";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  // Determine if job is saved
  const isSaved = user?.savedJobs?.some((entry) => {
    const id = entry?._id ?? entry; // handles array of IDs or objects
    return id?.toString() === job._id?.toString();
  });

  // Save/Unsave toggle
  const handleSaveToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/job/save/${job._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.user) {
        dispatch(setUser(res.data.user)); // update Redux
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    } finally {
      setLoading(false);
    }
  };

  // Share functionality
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
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const daysAgo = (date) => {
    const created = new Date(date);
    const diff = new Date() - created;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };
  const isNew = daysAgo(job?.createdAt) <= 2;

  const userSkills = user?.profile?.skills || [];
  const matchedSkills =
    job?.skillsRequired?.filter((skill) =>
      userSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    ) || [];

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 flex flex-col">
      {/* Top info */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-gray-500">
            {daysAgo(job?.createdAt) === 0
              ? "Today"
              : `${daysAgo(job?.createdAt)} days ago`}
          </p>
          {isNew && <Badge className="bg-red-100 text-red-600 text-xs">🔥 New</Badge>}
          {matchedSkills.length > 0 && (
            <Badge className="bg-green-100 text-green-700 text-xs">
              ✓ {matchedSkills.length} skill{matchedSkills.length > 1 ? "s" : ""} matched
            </Badge>
          )}
        </div>
        <Button
          onClick={handleSaveToggle}
          disabled={loading}
          variant="outline"
          className={`rounded-full p-2 ${isSaved ? "bg-green-600 text-white" : ""}`}
        >
          <Bookmark size={16} />
        </Button>
      </div>

      {/* Company info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h1 className="font-semibold text-base">{job?.company?.name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {job?.location || "Remote"}
          </p>
        </div>
      </div>

      {/* Job title & description */}
      <div className="mb-3">
        <h1 className="font-bold text-lg leading-snug">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className="bg-blue-100 text-blue-700 text-xs">Internship</Badge>
        <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
          💰 {job?.stipend || job?.salary || "Unpaid"}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 text-xs">
          ⏳ {job?.duration || "3 Months"}
        </Badge>
        <Badge className="bg-yellow-100 text-yellow-700 text-xs">🎓 Students</Badge>
      </div>

      {/* Skills */}
      {job?.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skillsRequired.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                matchedSkills.some((m) => m.toLowerCase() === skill.toLowerCase())
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between gap-2 mt-auto">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="flex-1"
        >
          View
        </Button>
        <Button
          onClick={handleSaveToggle}
          disabled={loading}
          className={`flex-1 ${isSaved ? "bg-green-600 text-white" : "bg-[#7209b7] text-white"}`}
        >
          {loading ? "Saving..." : isSaved ? "Saved ✓" : "Favorite"}
        </Button>
        <Button onClick={handleShare} variant="outline" className="px-3">
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;