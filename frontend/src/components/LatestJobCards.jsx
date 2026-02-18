import { Badge } from './ui/badge'
import React from 'react'

const LatestJobCards = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div>
                <h1 className='font-medium text-lg'>Company Name</h1>
                <p className='text-sm text-gray-500'>Nepal</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2' >Job Title</h1>
                <p className='text-sm text-gray-600'>lorem ipssum dolor</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant='ghost'>12Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant='ghost'>Part Time</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant='ghost'>Remote Job</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
