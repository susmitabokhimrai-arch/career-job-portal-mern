import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'

const AppliedJobTable = () => {
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
                    {[1, 2, 3, 4].map((item, index) => (
                        <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell>17-07-2025</TableCell>
                            <TableCell className="font-medium">
                                Frontend Developer
                            </TableCell>
                            <TableCell>Google</TableCell>
                            <TableCell className="text-right">
                                <Badge>Selected</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default AppliedJobTable