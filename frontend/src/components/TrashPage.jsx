import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarImage } from './ui/avatar';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import useGetTrashedCompanies from '@/hooks/useGetTrashedCompanies';
import useRestoreCompany from '@/hooks/useRestoreCompany';
import usePermanentDeleteCompany from '@/hooks/usePermanentDeleteCompany';
import { useSelector } from 'react-redux';
import Navbar from './shared/Navbar';
import { toast } from 'sonner';

const TrashPage = () => {
    // Fetch trashed companies when page loads
    useGetTrashedCompanies();
    const { trashedCompanies } = useSelector(store => store.company);
    const restoreCompany = useRestoreCompany();
    const permanentDeleteCompany = usePermanentDeleteCompany();

    // State for confirmation dialog
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Handle restore company
    const handleRestore = async (companyId) => {
        const result = await restoreCompany(companyId);
        if (result.success) {
            toast.success('Company restored successfully!'); 
        }
    }

    // Handle permanent delete
    const handlePermanentDelete = async (companyId) => {
        const result = await permanentDeleteCompany(companyId);
        if (result.success) {
            setConfirmDeleteId(null);
toast.success('Company permanently deleted!');   
     }
    }

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            Trash
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Companies moved to trash can be restored or permanently deleted
                        </p>
                    </div>

                    {/* Trash Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="px-4 py-2">Logo</TableHead>
                                    <TableHead className="px-4 py-2">Name</TableHead>
                                    <TableHead className="px-4 py-2">Deleted Date</TableHead>
                                    <TableHead className="px-4 py-2 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trashedCompanies?.length > 0 ? (
                                    trashedCompanies.map((company) => (
                                        <TableRow key={company._id} className="hover:bg-gray-50">
                                            <TableCell className="px-4 py-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={company.logo} />
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-700 font-medium">
                                                {company.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500">
                                                {company.deletedAt ? new Date(company.deletedAt).toLocaleDateString() : 'Unknown'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* Restore Button */}
                                                    <button
                                                        onClick={() => handleRestore(company._id)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                        Restore
                                                    </button>

                                                    {/* Permanent Delete Button */}
                                                    {confirmDeleteId === company._id ? (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handlePermanentDelete(company._id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirmDeleteId(company._id)}
                                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                                                        >
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Delete Forever
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            <Trash2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                            <p>Trash is empty</p>
                                            <p className="text-sm">Deleted companies will appear here</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrashPage;