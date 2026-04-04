import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, Camera, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authslice';

const UpdatePhotoDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError('');
    setPreview(null);
    setFile(null);

    if (!selected) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/photo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile photo updated successfully!");
        setOpen(false);
        setFile(null);
        setPreview(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-lg p-6"
        onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Update Profile Photo
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">JPG, PNG or WEBP • Max 2MB</p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Preview */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-200 shadow-md">
            <img
              src={preview || user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* File Input */}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-purple-50 
            text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 transition">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Choose Photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 
              px-3 py-2 rounded-lg w-full">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : 'Upload Photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePhotoDialog;
