import React from 'react';

const Modal = ({
    showModal,
    closeModal,
    title,
    fields,
    onSubmit,
    formData,
    onChange,
    submitText = 'Submit',
    cancelText = 'Cancel',
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
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

                {/* Modal Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>

                {/* Dynamic Form */}
                <form onSubmit={onSubmit} className="space-y-5">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={onChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    required={field.required}
                                />
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={onChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition duration-300"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition duration-300"
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
