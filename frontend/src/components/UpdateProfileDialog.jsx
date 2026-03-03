import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from './ui/dialog'
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
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: null, //user?.profile?.resume || "",
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        try{
            let res;
            const backendReady=false;//set this to true when backend is ready to handle profile update requests
       if(!backendReady){
        //mock fallback response until backend is ready
        const mockUser = {
            ...user,
            fullname: input.fullname,
            email: input.email,
            phoneNumber: input.phoneNumber,
            profile: {
                ...user?.profile,
                bio: input.bio,
                skills: input.skills.split(",").map(skill => skill.trim()),
                resume: input.file || user?.profile?.resume,
            },
        };
        dispatch(setUser(mockUser));
        toast.success("Profile updated successfully (mock response).Backend is not ready to handle profile updates yet.");
       //setLoading(false);
       setOpen(false);
       return;
    }
            //actual API call to update profile once backend is ready
      /*  const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
}else{
    */
   //json only request until backend is ready to handle multipart/form-data
   const payload = {
    fullname: input.fullname,
    email: input.email,
    phoneNumber: input.phoneNumber,
    bio: input.bio,
    skills: input.skills.split(",").map(skill => skill.trim()),
   };
   res= await axios.post(`${USER_API_END_POINT}/profile/update`, payload, {
    headers: {
        'content-Type': 'application/json' },
    withCredentials: true
   });
   /*try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, payload, {
                headers: {
                    'content-Type': 'application/json'
                },
                withCredentials: true
            });*/
            if (res?.data?.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile updated successfully");
            } else {
                //fallback safe update in case API returns success: false
                const fallbackUser = {
                    ...user,
                    fullname: input.fullname,
                    email: input.email,
                    phoneNumber: input.phoneNumber,
                    profile: {
                        ...user?.profile,
                        bio: input.bio,
                        skills: input.skills.split(",").map(skill => skill.trim()),
                        resume: input.file || user?.profile?.resume,
                    },
                };
                dispatch(setUser(fallbackUser));
                toast.success("Profile updated successfully (fallback update).");
        } 
        setOpen(false);
        console.log(input);
    }catch (error) {
         console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false);//ensure button never stucks
            
        /*}
        setOpen(false)
        console.log(input);*/
        }
    };
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className='text-right'>Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="e-mail" className='text-right'>E-mail</Label>
                                <Input
                                    id="e-mail"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className='text-right'>Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className='text-right'>Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skill" className='text-right'>Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className='text-right'>Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog