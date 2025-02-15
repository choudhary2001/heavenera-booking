import React from 'react';

const ReusableModal = ({ title, isOpen, onClose, children, onSubmit, submitText = 'Save' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm top-0 left-0 right-0 bottom-0">
            <div className="relative bg-white  rounded-lg shadow-xl max-w-full max-w-2xl animate-fadeIn h-auto max-h-[90vh] overflow-y-auto" style={{ height: "auto", maxHeight: "90vh", width: "auto", maxWidth: "90vw" }}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200 w-5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Modal Content */}
                <form onSubmit={onSubmit} className="space-y-5 p-8">
                    {children}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-gray-500 transition duration-300 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green text-white font-medium rounded-md hover:bg-green-700 transition duration-300"
                            style={{ backgroundColor: "green" }}
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReusableModal;
