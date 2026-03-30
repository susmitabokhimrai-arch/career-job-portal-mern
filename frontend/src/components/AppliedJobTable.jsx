import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div className="w-full overflow-x-auto bg-white shadow-card rounded-xl p-6">
            <Table className="w-full">
                <TableCaption className="text-gray-500 test-sm pb-4">
                    Track the status of your job applications
                </TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Job Role</TableHead>
                        <TableHead className="font-semibold text-gray-700">Company</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                    allAppliedJobs.length <= 0 ? (
                        <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">
                                    You haven't applied to any job yet.
                                </td>
                            </tr>
    ):(
         allAppliedJobs.map((appliedJob) => (
                                <TableRow
                                    key={appliedJob._id}
                                    className="hover:bg-gray-50 transition-colors rounded-md"
                                >
                            <TableCell className="py-3">{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                            <TableCell className="py-3">{appliedJob.job?.title}</TableCell>
                            <TableCell className="py-3">{appliedJob.job?.company?.name}</TableCell>
                            <TableCell className="text-right py-3">
                                <Badge className={`
                                px-3 py-1 rounded-full text-white text-sm
                                ${appliedJob?.status === "rejected" && 'bg-red-500' }
                                ${appliedJob?.status === "applied" && 'bg-gray-500' }
                                ${appliedJob?.status === "shortlisted" && 'bg-yellow-500'}
                                ${appliedJob?.status === "interview" && 'bg-blue-500'}
                                ${appliedJob?.status === "selected" && 'bg-green-500'}
                                `}>
                                {appliedJob?.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                
               ) }
                </TableBody>

            </Table>
        </div>
    )
}

export default AppliedJobTable