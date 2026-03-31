import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { setUser } from '@/redux/authslice'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(",") || "",
    file: user?.profile?.resume || ""
  });

  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if(input.file){
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
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg p-6" onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-5 py-4'>
            {[
              { label: "Name", name: "fullname", type: "text" },
              { label: "E-mail", name: "email", type: "email" },
              { label: "Number", name: "phoneNumber", type: "text" },
              { label: "Bio", name: "bio", type: "text" },
              { label: "Skills", name: "skills", type: "text" },
            ].map(field => (
              <div className='grid grid-cols-4 items-center gap-4' key={field.name}>
                <Label htmlFor={field.name} className='text-right font-medium text-gray-700'>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={input[field.name]}
                  onChange={changeEventHandler}
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                />
              </div>
            ))}
            {/* File Input */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="file" className='text-right font-medium text-gray-700'>Resume</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="col-span-3 border-dashed border-2 border-gray-300 p-2 rounded-lg cursor-pointer hover:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              className={`w-full my-4 ${loading ? 'cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <><Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please Wait</> : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog