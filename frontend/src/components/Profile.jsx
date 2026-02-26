import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'

const skills = ["HTML", "CSS", "JavaScript", "ReactJS"]
const isResume = true;

const Profile = () => {
const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Profile Card */}
            <div className='max-w-4xl mx-auto bg-white shadow-lg border border-gray-100 rounded-2xl my-8 p-8'>

                {/* Top Section */}
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-5'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src="https://img.freepik.com/premium-vector/creative-elegant-abstract-minimalistic-logo-design-vector-any-brand-company_1253202-137644.jpg"
                                alt="profile"
                            />
                        </Avatar>

                        <div>
                            <h1 className='font-semibold text-2xl'>
                                Full Name
                            </h1>
                            <p className='text-gray-600 text-sm mt-1'>
                                Passionate Frontend Developer building modern web applications.
                            </p>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <Button onClick={() => setOpen(true)}
                        variant='outline'
                        size='icon'
                        className='rounded-full'
                    >
                        <Pen className='w-4 h-4' />
                    </Button>
                </div>

                {/* Contact Info */}
                <div className='my-6 space-y-3'>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <Mail className='w-4 h-4' />
                        <span>niki@gmail.com</span>
                    </div>

                    <div className='flex items-center gap-3 text-gray-700'>
                        <Contact className='w-4 h-4' />
                        <span>9876543210</span>
                    </div>
                </div>

                {/* Skills */}
                <div className='my-6'>
                    <h2 className='font-semibold text-lg mb-3'>Skills</h2>

                    <div className='flex flex-wrap gap-2'>
                        {
                            skills.length !== 0 ? (
                                skills.map((item, index) => (
                                    <Badge
                                        key={index}
                                        className="px-3 py-1 text-sm"
                                    >
                                        {item}
                                    </Badge>
                                ))
                            ) : (
                                <span>NA</span>
                            )
                        }
                    </div>
                </div>

                {/* Resume */}
                <div className='mt-6'>
                    <Label className='text-md font-semibold'>Resume</Label>

                    {
                        isResume ? (
                            <a
                                target='_blank'
                                rel="noopener noreferrer"
                                href='https://youtube.com/@patelmernstack'
                                className='block text-blue-600 font-medium hover:underline mt-1'
                            >
                                View Resume
                            </a>
                        ) : (
                            <span className='text-gray-500'>NA</span>
                        )
                    }
                </div>
            </div>

            {/* Applied Jobs Section */}
            <div className='max-w-4xl mx-auto bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-10'>
                <h2 className='font-semibold text-xl mb-4'>
                    Applied Jobs
                </h2>

                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile