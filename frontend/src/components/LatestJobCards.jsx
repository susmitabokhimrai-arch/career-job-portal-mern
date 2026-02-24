import { Badge } from './ui/badge'
import React from 'react'

const LatestJobCards = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div>
                <h1 className='font-medium text-lg'>{job?.Company?.Name}</h1>
                <p className='text-sm text-gray-500'>Nepal</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2' >{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant='ghost'>{job?.Position}</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant='ghost'>{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant='ghost'>{job?.salary}</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
