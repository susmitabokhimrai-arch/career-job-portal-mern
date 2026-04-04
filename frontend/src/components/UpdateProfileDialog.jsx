import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Camera, Eye } from 'lucide-react';
import UpdateProfileDialog from './UpdateProfileDialog';
import UpdatePhotoDialog from './UpdatePhotoDialog';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RecruiterProfile = () => {
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();
  const isRecruiter = user?.role === 'recruiter' || user?.role === 'company';
  const isUser = user?.role === 'student' || user?.role === 'user' || user?.role === 'candidate';

   const handleViewProfile = () => {
    navigate(`/profile/${user?._id}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-white">
              
                <h2 className="text-2xl font-bold">
                  {isAdmin ? "Admin Profile" : isRecruiter ? "Recruiter Profile" : "User Profile"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {isAdmin 
                    ? "Manage system settings" 
                    : isRecruiter 
                    ? "Manage your recruiter information" 
                    : "Manage your personal information"}
                </p>
              </div>
  
              {!isAdmin && (
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
                >
                  <Pen className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}
              
              {/* View Profile button - only show for Recruiter and User, not for Admin */}
              {(isRecruiter || isUser) && (
                <Button
                  onClick={handleViewProfile}
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white ml-2"
                >
                  <Eye className="w-4 h-4 mr-2" /> View Profile
                </Button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex items-center gap-6">

              {/* Avatar with camera button */}
              <div className="relative">
                <Avatar className="h-28 w-28 ring-4 ring-blue-100">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      'https://github.com/shadcn.png'
                    }
                    alt="profile"
                    className="object-cover"
                  />
                </Avatar>
                {/* Camera button - show for Recruiter and User, hide for Admin */}
                {(isRecruiter || isUser) && user?.profile?.canUpdatePhoto ? (
                  <button
                    onClick={() => setOpenPhoto(true)}
                    title="Update profile photo"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (isRecruiter || isUser) && (
                  <div title="Contact admin to enable photo update"
                    className="absolute bottom-0 right-0 bg-gray-400 text-white p-1.5 rounded-full shadow-md cursor-not-allowed"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
               
                <h1 className="font-bold text-3xl text-gray-800">{user?.fullname || 'User'}</h1>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    isAdmin ? 'bg-red-500' : isRecruiter ? 'bg-green-500' : 'bg-blue-500'
                  }`}></span>
                  {isAdmin ? 'Administrator' : isRecruiter ? 'Recruiter' : 'Student'}
                </p>
                <p className="text-gray-600 text-sm mt-2 max-w-md">
                  {user?.profile?.bio || (isAdmin ? 'System administrator' : isRecruiter ? 'No bio added yet. Click Edit Profile to add one.' : 'Tell us about yourself')}
                </p>

                {/* Only show photo update permission message for non-admin users */}
                {(isRecruiter || isUser) && !user?.profile?.canUpdatePhoto && (
                  <p className="text-xs text-gray-400 mt-2">
                    🔒 Photo update not enabled. Contact admin.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info*/}
            <div className="grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Contact className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium">{user?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            {/* Show system stats or admin-specific info here if needed */}
            {isAdmin && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">Admin Access</p>
                <p className="text-xs text-blue-600 mt-1">Full system access • Manage users • View analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Only show UpdateProfileDialog for non-admin users */}
      {!isAdmin && (
        <UpdateProfileDialog open={open} setOpen={setOpen} />
      )}
      
      {/* Only show UpdatePhotoDialog for non-admin users */}
      {(isRecruiter || isUser) && (
        <UpdatePhotoDialog open={openPhoto} setOpen={setOpenPhoto} />
      )}
    </div>
  );
};

export default RecruiterProfile;