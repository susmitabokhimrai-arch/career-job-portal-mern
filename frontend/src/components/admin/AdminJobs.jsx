import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { LucideSearch } from 'lucide-react'

const AdminJobs = () => {
  const { fetchAllAdminJobs } = useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllAdminJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10 px-4'>
        <div className='flex flex-col md:flex-row items-center justify-between my-5 gap-4'>
          
          <div className='relative w-full md:w-1/2'>
          <Input
            className="w-full rounded-lg pl-10 pr-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            placeholder="Filter by company name or role"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
dispatch(setSearchJobByText(e.target.value))
            }}
          />
           <LucideSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          </div>
          < Button
          onClick={() => navigate("/admin/jobs/create")} 
           className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 shadow-sm transition">
        New Job
        </Button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AdminJobsTable />
      </div>
    </div>
    </div>
  )
}

export default AdminJobs

