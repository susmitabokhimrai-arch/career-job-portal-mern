import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge'
import React from 'react'
import { MapPin } from 'lucide-react';

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name || job?.Company?.Name}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {job?.location || 'Remote'}
          </p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2' >{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className="bg-blue-100 text-blue-700 text-xs whitespace-nowrap">
                          Internship
                        </Badge>
                
                        <Badge className="bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap">
                          💰 {job?.stipend || job?.salary || 'Unpaid'}
                        </Badge>
                
                        <Badge className="bg-purple-100 text-purple-700 text-xs whitespace-nowrap">
                          ⏳ {job?.duration || '3 Months'}
                        </Badge>
                
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs whitespace-nowrap">
                          🎓 Students
                        </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
