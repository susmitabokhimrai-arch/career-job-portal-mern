import React, { useState, useEffect } from 'react'

const DeleteCompanyModal = ({ company, onConfirm, onCancel }) => {
  // State for "Do not ask me again" checkbox
  const [dontAskAgain, setDontAskAgain] = useState(false);

  // Load saved preference from localStorage when modal opens
  useEffect(() => {
    const savedPreference = localStorage.getItem('dontAskDeleteConfirmation');
    if (savedPreference === 'true') {
      setDontAskAgain(true);
    }
  }, []);

  // Handle confirm delete
  const handleConfirm = () => {
    // Save preference to localStorage if checkbox is checked
    if (dontAskAgain) {
      localStorage.setItem('dontAskDeleteConfirmation', 'true');
    } else {
      localStorage.setItem('dontAskDeleteConfirmation', 'false');
    }
    onConfirm();
  }

  // Handle cancel
  const handleCancel = () => {
    onCancel();
  }

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setDontAskAgain(e.target.checked);
  }

  return (
    <>
      {/* Modal Overlay - Dark background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleCancel}
      >
        {/* Modal Content - Fixed width with proper styling */}
        <div 
          className="bg-white rounded-lg shadow-xl w-[500px] max-w-[90%] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Body */}
          <div className="p-6">
            {/* Question */}
            <p className="text-gray-900 text-[15px] mb-3">
              Are you sure you want to delete <strong className="font-semibold text-gray-900">'{company?.name}'</strong>?
            </p>
            
            {/* Warning message */}
            <p className="text-gray-500 text-[13px] mb-5">
              You can restore this company from the Trash.
            </p>
            
            {/* "Do not ask me again" checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={handleCheckboxChange}
                className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-600 text-[13px]">Do not ask me again</span>
            </label>
          </div>
          
          {/* Modal Footer - Buttons in horizontal row */}
          <div className="flex justify-end items-center gap-2 px-6 pb-6">
            {/* Cancel button */}
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition duration-150"
            >
              Cancel
            </button>
            
            {/* Move to Trash button */}
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-[13px] font-medium text-white bg-red-600 rounded hover:bg-red-700 transition duration-150"
            >
              Move to Trash
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteCompanyModal