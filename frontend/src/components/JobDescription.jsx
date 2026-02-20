import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const JobDescription = () => {
    const isApplied = false;
    return (
        <div className='min-h-screen bg-gray-50 py-10 px-4'>
            <div className="max-w-4xl mx-auto bg-white shadoow-lg rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                    {/* LEFT SIDE */}
                    <div>
                        <h1 className="text-3xl font-bold mb-3 text-gay-800">Frontend Developer</h1>

                        <div className="flex flex-wrap gap-3">
                            <Badge className="bg-blue-50 text-blue-600">12 Positions</Badge>
                            <Badge className="bg-red-50 text-red-600">Part Time</Badge>
                            <Badge className="bg-purple-50 text-purple-600">24 LPA</Badge>
                        </div>
                    </div>

                    {/* RIGHT SIDE BUTTON */}
                    <Button
                    className={`rounded-lg px-4 py-2 ${isApplied
                            ? "bg-gray-600 opacity-70 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                    onClick={!isApplied ? () => console.log("Apply") : undefined}
                >
                        {isApplied ? "Already Applied" : "Apply Now"}
                    </Button>
                </div>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Role:<span className='pl-4 font-normal text-gray-800'>Frontend Developer</span></h1>
                    <h1 className='font-bold my-1'>Location:<span className='pl-4 font-normal text-gray-800'>ktm</span></h1>
                    <h1 className='font-bold my-1'>Description:<span className='pl-4 font-normal text-gray-800'>lorem ipsum,dolor sit amet</span></h1>
                    <h1 className='font-bold my-1'>Experience:<span className='pl-4 font-normal text-gray-800'>2 yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary:<span className='pl-4 font-normal text-gray-800'>12 LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicant:<span className='pl-4 font-normal text-gray-800'>4</span></h1>
                    <h1 className='font-bold my-1'>Posted Date:<span className='pl-4 font-normal text-gray-800'>17-07-2024</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
