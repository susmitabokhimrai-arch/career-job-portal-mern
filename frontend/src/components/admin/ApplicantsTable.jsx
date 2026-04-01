import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortListingStatus = ["applied", "shortlisted", "interview", "selected", "rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const [localApplicants, setLocalApplicants] = useState([]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // sync redux data → local state
    useEffect(() => {
        setLocalApplicants(applicants?.applications || []);
    }, [applicants]);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status }
            );

            if (res.data.success) {
                const applicant = localApplicants.find(app => app._id === id);
            const applicantName = applicant?.applicant?.fullname || "Candidate";

            switch(status) {
                case "selected":
                    toast.success(`🎉 ${applicantName} has been SELECTED! Congratulations!`);
                    break;
                case "rejected":
                    toast.error(`❌ ${applicantName} has been Rejected.`);
                    break;
                case "interview":
                    toast.info(`📅 ${applicantName} moved to Interview stage.`);
                    break;
                case "shortlisted":
                    toast.success(`⭐ ${applicantName} has been Shortlisted!`);
                    break;
                case "applied":
                    toast.info(`📝 ${applicantName} status set to Applied.`);
                    break;
                default:
                    toast.success(res.data.message || `Status updated to ${status}`);
            }
                    // update UI instantly
                const updated = localApplicants.map((app) =>
                    app._id === id ? { ...app, status } : app
                );

                setLocalApplicants(updated);
            }
        } catch (error) {
            console.error("Status update error:", error);
            console.error("Error response:", error.response?.data);
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

    // status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case "selected":
                return "bg-green-500";
            case "rejected":
                return "bg-red-500";
            case "interview":
                return "bg-blue-500";
            case "shortlisted":
                return "bg-yellow-500 text-black";
            default:
                return "bg-gray-400";
        }
    };

    // filter + search logic
    const filteredApplicants = localApplicants.filter((item) => {
        const matchesSearch =
            item?.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            item?.applicant?.email?.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" || item.status === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white p-5 rounded-xl shadow">

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-full md:w-1/3 text-gray-700" // ✅ CHANGED: added text color
                />

                <div className="flex gap-2 flex-wrap">
                    {["all", "applied", "shortlisted", "interview", "selected", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1 rounded text-sm capitalize transition-colors // ✅ CHANGED: added transition
                                ${filter === s 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200" // ✅ CHANGED: added text color for inactive state
                                }
                            `}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        filteredApplicants.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50 transition">

                                <TableCell className="text-gray-700">{item?.applicant?.fullname}</TableCell> {/* ✅ CHANGED: added text color */}
                                <TableCell className="text-gray-700">{item?.applicant?.email}</TableCell> {/* ✅ CHANGED: added text color */}
                                <TableCell className="text-gray-700">{item?.applicant?.phoneNumber}</TableCell> {/* ✅ CHANGED: added text color */}

                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume ? (
                                            <a
                                                className="text-blue-600 hover:underline font-medium" // ✅ CHANGED: made link more visible
                                                href={item?.applicant?.profile?.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">NA</span> // ✅ CHANGED: added text color
                                        )
                                    }
                                </TableCell>

                                <TableCell className="text-gray-700"> {/* ✅ CHANGED: added text color */}
                                    {item?.applicant?.createdAt?.split("T")[0]}
                                </TableCell>

                                {/* Status Badge */}
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded text-white text-xs font-medium capitalize ${getStatusColor(item.status)}`}
                                    >
                                        {item.status}
                                    </span>
                                </TableCell>

                                <TableCell className='text-right'>
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-gray-900" /> {/* ✅ CHANGED: added icon color */}
                                        </PopoverTrigger>

                                        {/* ✅ FIXED: Popover content styling - this is the main fix for invisible text */}
                                        <PopoverContent className="w-36 p-2 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                                            {
                                                shortListingStatus.map((status, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        className='px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm capitalize text-gray-700 hover:text-gray-900 transition-colors' // ✅ CHANGED: added text colors and hover state
                                                    >
                                                        {status}
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;