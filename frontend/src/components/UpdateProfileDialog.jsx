import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, AlertCircle, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { setUser } from '@/redux/authslice'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const { user } = useSelector(store => store.auth)

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(",") || "",
    file: null
  });

  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  // ✅ PDF Validation Function
  const validatePDF = (file) => {
    // Check if file exists
    if (!file) {
      return { valid: false, message: 'No file selected' };
    }

    // Check file type (must be PDF)
    if (file.type !== 'application/pdf') {
      return { 
        valid: false, 
        message: '❌ Only PDF files are allowed. Please upload a PDF document.' 
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        message: '❌ File size must be less than 5MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB' 
      };
    }

    return { valid: true, message: '✅ PDF file is valid!' };
  }

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    setSelectedFileName('');
    
    if (file) {
      // Validate the file
      const validation = validatePDF(file);
      
      if (!validation.valid) {
        // Show error message
        setFileError(validation.message);
        toast.error(validation.message);
        e.target.value = ''; // Clear the input
        setInput({ ...input, file: null });
        return;
      }
      
      // File is valid
      setSelectedFileName(file.name);
      setInput({ ...input, file });
      toast.success(`✅ PDF selected: ${file.name}`);
    } else {
      setInput({ ...input, file: null });
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    
    // ✅ Additional validation before submission
    if (input.file) {
      const validation = validatePDF(input.file);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }
    }
    
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    
    // Only append file if a new file is selected
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false)
        // Reset file input after successful update
        setInput({ ...input, file: null });
        setSelectedFileName('');
        setFileError('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-xl shadow-lg p-6" onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Update Profile</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Update your personal information and resume</p>
        </DialogHeader>
        
        <form onSubmit={submitHandler}>
          <div className='grid gap-5 py-4 max-h-[60vh] overflow-y-auto px-1'>
            {/* Personal Information Fields */}
            {[
              { label: "Full Name", name: "fullname", type: "text", placeholder: "Enter your full name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email address" },
              { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "Enter your phone number" },
              { label: "Bio", name: "bio", type: "text", placeholder: "Tell us about yourself" },
              { label: "Skills", name: "skills", type: "text", placeholder: "React, Node.js, MongoDB (comma separated)" },
            ].map(field => (
              <div className='grid grid-cols-4 items-center gap-4' key={field.name}>
                <Label htmlFor={field.name} className='text-right font-medium text-gray-700'>
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={input[field.name]}
                  onChange={changeEventHandler}
                  placeholder={field.placeholder}
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                />
              </div>
            ))}
            
            {/* Resume File Input with PDF Validation */}
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor="file" className='text-right font-medium text-gray-700 pt-2'>
                Resume (PDF)
              </Label>
              <div className="col-span-3">
                <div className={`border-2 border-dashed rounded-lg p-3 transition-all ${
                  fileError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500'
                }`}>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={fileChangeHandler}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>Only PDF files, max 5MB</span>
                  </div>
                  
                  {/* Selected File Info */}
                  {selectedFileName && !fileError && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Selected: {selectedFileName}</span>
                    </div>
                  )}
                  
                  {/* Current Resume Info */}
                  {user?.profile?.resumeOriginalName && !input.file && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>Current: {user?.profile?.resumeOriginalName}</span>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {fileError && (
                    <div className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span>{fileError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="submit"
              className={`w-full py-2 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog