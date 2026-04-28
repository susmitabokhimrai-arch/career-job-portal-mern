import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Avatar, AvatarImage } from '../../components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DeleteCompanyModal from './DeleteCompanyModal'
import useSoftDeleteCompany from '@/hooks/useSoftDeleteCompany'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
const softDeleteCompany = useSoftDeleteCompany();
    // State for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    // Function to handle delete click
    const handleDeleteClick = (company) => {
        // Check if user doesn't want confirmation
        const dontAsk = localStorage.getItem('dontAskDeleteConfirmation') === 'true';

        if (dontAsk) {
            // Directly delete without showing modal
            softDeleteCompany(company._id);
        } else {
            // Show modal as normal
            setCompanyToDelete(company);
            setShowDeleteModal(true);
        }
    }

    // Function to handle confirm delete
    const handleConfirmDelete = async () => {
        if (companyToDelete) {
            await softDeleteCompany(companyToDelete._id);
        }
        setShowDeleteModal(false);
        setCompanyToDelete(null);
    }
    // Function to handle cancel delete
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCompanyToDelete(null);
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <TableCaption className="text-center text-gray-500 text-sm pb-4">A list of your recent registered companies</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Logo</TableHead>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Name</TableHead>
                        <TableHead className="text-left text-gray-700 font-medium px-4 py-2">Date</TableHead>
                        <TableHead className="text-right text-gray-700 font-medium px-4 py-2">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany?.length > 0 ?
                        filterCompany.map((company) => (
                            <TableRow key={company._id} className="hover:bg-gray-50 transition duration-200">
                                <TableCell className="px-4 py-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-700 font-medium">{company.name}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-500">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                            <div className="p-2 hover:bg-gray-100 rounded-full inline-flex">
                                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-36 bg-white shadow-lg border rounded-md p-2">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-full cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md transition'>
                                                <Edit2 className='w-4 h-4 text-gray-600' />
                                                <span className="text-gray-700 text-sm">Edit</span>
                                            </div>
                                            {/* Delete button */}
                                            <div onClick={() => handleDeleteClick(company)} className='flex items-center gap-2 w-full cursor-pointer px-2 py-1 hover:bg-red-50 rounded-md transition mt-1'>
                                                <Trash2 className='w-4 h-4 text-red-500' />
                                                <span className="text-red-500 text-sm">Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>

                            </TableRow>


                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                    No companies found
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && companyToDelete && (
                <DeleteCompanyModal
                    company={companyToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}

export default CompaniesTable
