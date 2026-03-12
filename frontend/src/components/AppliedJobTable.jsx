import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableCaption className="text-gray-500">
                    Track the status of your job applications
                </TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Job Role</TableHead>
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                    allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> :  allAppliedJobs.map((appliedJob) => (
                        <TableRow
                            key={appliedJob._id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                            <TableCell>{appliedJob.job?.title}</TableCell>
                            <TableCell>{appliedJob.job?.company?.name}</TableCell>
                            <TableCell className="text-right">
                                <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default AppliedJobTable