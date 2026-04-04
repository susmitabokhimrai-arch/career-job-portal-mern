import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { Badge } from './ui/badge'
import { Loader2 } from 'lucide-react'

const RecommendedJobs = () => {
  const { user } = useSelector(store => store.auth)
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!user) return;

  const fetchRecommendedJobs = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/jobs/recommended`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setRecommendedJobs(res.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRecommendedJobs();
}, [user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Recommended Jobs</h1>
      <p className="text-gray-500 mb-6">
        Based on your skills:{" "}
        {user?.profile?.skills?.length > 0 ? (
          user.profile.skills.map((skill, i) => (
            <span key={i} className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-1">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-red-400 text-sm">No skills added yet. Update your profile!</span>
        )}
      </p>

      {recommendedJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No recommended jobs found.</p>
          <p className="text-sm mt-1">Try updating your profile with more skills.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recommendedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                  <p className="text-sm text-gray-500">
                    {job.company?.name} &bull; {job.location}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {job.internshipType}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>

              
              {job.requirements?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.requirements.map((req, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {req}
                    </Badge>
                  ))}
                </div>
              )}

              
              {job.skillsRequired?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((skill, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      ✓ {skill}
                    </Badge>
                  ))}
                </div>
              )}

              
              <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-400">
                <span>{job.internshipType}</span>
                <span>&bull;</span>
                <span>Duration: {job.duration}</span>
                <span>&bull;</span>
                <span>Position: {job.position}</span>
                {job.stipend && (
                  <>
                    <span>&bull;</span>
                    <span>Stipend: {job.stipend}</span>
                  </>
                )}
                {job.applicationDeadline && (
                  <>
                    <span>&bull;</span>
                    <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              {job.perks?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.perks.map((perk, i) => (
                    <span key={i} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      🎁 {perk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecommendedJobs