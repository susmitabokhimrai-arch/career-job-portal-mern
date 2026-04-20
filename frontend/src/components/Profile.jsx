import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Bookmark, FileText, Eye, Download, File, CheckCircle, Calendar, X, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const savedCount = user?.savedJobs?.length || 0;

  const getFileInfo = (fileName) => {
    if (!fileName)
      return {
        extension: 'pdf',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        displayExt: 'PDF',
      };

    const ext = fileName.split('.').pop().toLowerCase();
    const colors = {
      pdf: { color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', displayExt: 'PDF' },
    };
    return colors[ext] || {
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      displayExt: ext.toUpperCase() || 'FILE',
    };

  };

  const fileInfo = getFileInfo(user?.profile?.resumeOriginalName);
  const fileName = user?.profile?.resumeOriginalName || 'Resume.pdf';
  const hasResume = user?.profile?.resume ? true : false;
  const isPDF = user?.profile?.resumeOriginalName?.toLowerCase().endsWith('.pdf');

  // View Resume
  const handleViewResume = () => {
    if (hasResume) setShowPdfViewer(true);

  };

  // Download Resume
  const handleDownloadResume = () => {
    if (user?.profile?.resume) {
      const link = document.createElement('a');
      link.href = user?.profile?.resume;
      link.download = user?.profile?.resumeOriginalName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <p className="text-purple-100 text-sm mt-1">Manage your personal information and resume</p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
              >
                <Pen className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                <Avatar className="h-28 w-28 ring-4 ring-purple-100">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      'https://img.freepik.com/premium-vector/creative-elegant-abstract-minimalistic-logo-design-vector-any-brand-company_1253202-137644.jpg'
                    }
                    alt="profile"
                    className="object-cover"
                  />
                </Avatar>
                <div>
                  <h1 className="font-bold text-3xl text-gray-800">{user?.fullname || 'User'}</h1>
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    {user?.role === 'student'
                      ? 'Student'
                      : user?.role === 'admin'
                        ? 'Administrator'
                        : user?.role === 'hr'
                          ? 'HR Professional'
                          : 'Job Seeker'}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 max-w-md">
                    {user?.profile?.bio || 'No bio available. Click edit to add your professional summary.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4 my-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Contact className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium">{user?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="my-6">
              <h2 className="font-semibold text-lg mb-3 text-gray-800">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((item, index) => (
                    <Badge key={index} className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills added yet</span>
                )}
              </div>
            </div>

            {/* Resume Section */}
            {/* Resume Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">Resume / CV</h2>
                    <p className="text-xs text-gray-400">Your professional resume</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/resume-builder")}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Build Resume
                </button>
              </div>

              {hasResume ? (
                isPDF ? (
                  <div className="rounded-xl border border-purple-100 bg-purple-50 p-5 transition-all hover:shadow-md">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                          <File className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{fileName}</h3>
                            <Badge className="bg-green-100 text-green-700 border-none text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" /> PDF Document
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Uploaded
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleViewResume}
                          className="group px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View</span>
                        </button>
                        <button
                          onClick={handleDownloadResume}
                          className="group px-4 py-2 bg-white text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-red-800">Invalid File Format</h3>
                          <Badge className="bg-red-100 text-red-700 border-none text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" /> Invalid
                          </Badge>
                        </div>
                        <p className="text-sm text-red-600">
                          "{fileName}" is not a PDF. Only PDF files are allowed.
                        </p>
                        <p className="text-xs text-red-500 mt-1">
                          Click "Edit Profile" to upload a valid PDF resume.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">No resume uploaded yet</p>
                  <p className="text-sm text-gray-400 mb-4">Upload a PDF or build one using our Resume Builder</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setOpen(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-100 transition"
                    >
                      Upload Resume
                    </button>
                    <button
                      onClick={() => navigate("/resume-builder")}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 transition"
                    >
                      Build with AI ✨
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Jobs Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Saved Jobs</p>
                    <p className="text-sm text-gray-500">
                      {savedCount} {savedCount === 1 ? 'job' : 'jobs'} saved for later
                    </p>
                  </div>
                </div>
                <Link to="/saved-jobs">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    View Saved Jobs
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-xl text-gray-800">Applied Jobs</h2>
          </div>
          <div className="p-0">
            <AppliedJobTable />
          </div>
        </div>

      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />

      {/* Only show if it's a valid PDF */}
      {showPdfViewer && user?.profile?.resume && isPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-11/12 h-5/6 flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${fileInfo.bgColor} flex items-center justify-center`}>
                  <File className={`w-5 h-5 ${fileInfo.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
                  <p className="text-xs text-gray-500">PDF Document Preview</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadResume}
                  className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4 bg-gray-100">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(user?.profile?.resume)}&embedded=true`}
                className="w-full h-full rounded-lg shadow-inner border-0"
                title="Resume Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;