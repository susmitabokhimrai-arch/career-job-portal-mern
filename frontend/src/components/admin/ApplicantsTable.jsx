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
import { MoreHorizontal, Eye, Download, X } from 'lucide-react';
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

    // Added state for PDF modal
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfFileName, setPdfFileName] = useState('');
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
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

                switch (status) {
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
    // Handle View Resume using Google Docs Viewer to prevent auto-download
    const handleViewResume = async (resumeUrl, fileName) => {
        if (!resumeUrl) {
            toast.error("No resume available to view");
            return;
        }

        setIsLoadingPdf(true);
        toast.loading("Loading resume...", { id: "view" });

        try {
            // Use Google Docs Viewer to force PDF display in browser
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

            // Open PDF in modal using Google Viewer
            setPdfUrl(googleViewerUrl);
            setPdfFileName(fileName || "Resume.pdf");
            setPdfModalOpen(true);
            toast.success("Resume loaded", { id: "view" });
        } catch (error) {
            console.error("View error:", error);
            toast.error("Unable to load resume. Please try downloading instead.", { id: "view" });
        } finally {
            setIsLoadingPdf(false);
        }
    };
    // Handle Download Resume
    const handleDownloadResume = async (resumeUrl, fileName) => {
        if (!resumeUrl) {
            toast.error("No resume available to download");
            return;
        }
        try {
            // Show loading toast
            toast.loading("Downloading resume...", { id: "download" });

            // Fetch the file from the URL
            const response = await fetch(resumeUrl);
            const blob = await response.blob();

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up
            window.URL.revokeObjectURL(url);

            // Show success
            toast.success(`Downloaded ${fileName}`, { id: "download" });
        } catch (error) {
            console.error('Download error:', error);
            toast.error("Error downloading file. Please try again.", { id: "download" });
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
                    className="border px-3 py-2 rounded w-full md:w-1/3 text-gray-700"
                />

                <div className="flex gap-2 flex-wrap">
                    {["all", "applied", "shortlisted", "interview", "selected", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1 rounded text-sm capitalize transition-colors 
                                ${filter === s
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

                                <TableCell className="text-gray-700">{item?.applicant?.fullname}</TableCell>
                                <TableCell className="text-gray-700">{item?.applicant?.email}</TableCell>
                                <TableCell className="text-gray-700">{item?.applicant?.phoneNumber}</TableCell>
                                {/* Resume column with View and Download buttons */}
                                <TableCell>
                                    {item?.applicant?.profile?.resume ? (
                                        <div className="flex gap-2 items-center">
                                            {/* Resume filename link */}
                                            <a
    className="text-blue-600 hover:underline font-medium text-sm truncate max-w-[150px] cursor-pointer"
    onClick={(e) => {
        e.preventDefault();
        handleViewResume(
            item?.applicant?.profile?.resume,
            item?.applicant?.profile?.resumeOriginalName || "resume.pdf"
        );
    }}
>
    {item?.applicant?.profile?.resumeOriginalName || "Resume.pdf"}
</a>
                                            {/* View Button */}
                                            <button
                                                onClick={() => handleViewResume(
                                                    item?.applicant?.profile?.resume,
                                                    item?.applicant?.profile?.resumeOriginalName || "resume.pdf"
                                                )}
                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                title="View Resume"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {/* Download Button */}
                                            <button
                                                onClick={() => handleDownloadResume(
                                                    item?.applicant?.profile?.resume,
                                                    item?.applicant?.profile?.resumeOriginalName || "resume.pdf"
                                                )}
                                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                                title="Download Resume"
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">NA</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-700">
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
                                            <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-gray-900" />
                                        </PopoverTrigger>

                                        <PopoverContent className="w-36 p-2 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                                            {shortListingStatus.map((status, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    className='px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm capitalize text-gray-700 hover:text-gray-900 transition-colors'
                                                >
                                                    {status}
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {/* PDF Modal for viewing resume without downloading */}
            {pdfModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        // Close modal when clicking outside the content
                        if (e.target === e.currentTarget) setPdfModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg w-[95vw] max-w-6xl h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                                Resume Preview: {pdfFileName}
                            </h3>
                            <button
                                onClick={() => setPdfModalOpen(false)}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors ml-4"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Modal Body with PDF iframe */}
                        <div className="flex-1 p-2 bg-gray-100 overflow-auto">
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full rounded border-0"
                                title="Resume Viewer"
                            />
                        </div>
                        {/* Modal Footer with actions */}
                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => {
                                    const originalUrl = decodeURIComponent(pdfUrl.split('url=')[1]?.split('&')[0] || pdfUrl);
                                    handleDownloadResume(originalUrl, pdfFileName);
                                }}
                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
                            >
                                <Download size={18} />
                                Download
                            </button>
                            <button
                                onClick={() => setPdfModalOpen(false)}
                                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
                            >
                                <X size={18} />
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantsTable;