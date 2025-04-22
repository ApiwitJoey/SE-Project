import React from "react";

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full space-y-6">
        {/* Checkmark with Circular Spinner */}
        <div className="flex justify-center items-center mb-6 relative">
          {/* Spinner Circle */}
          <div className="absolute w-16 h-16 border-4 border-t-4 border-green-600 rounded-full animate-spin"></div>
          
          {/* Checkmark Icon */}
          <svg
            className="z-10 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="36"
            height="36"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Success Message */}
        <h3 className="text-green-600 font-semibold text-lg text-center">{message}</h3>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
