import React, { useEffect } from "react";

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
  confirmColor?: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose, confirmColor }) => {
  useEffect(() => {
    // Auto-close the popup after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-md mx-auto space-y-4">
        {/* Checkmark with Circular Spinner */}
        <div className="flex justify-center items-center relative mb-4">
          {/* Spinner Circle */}
          <div className={`absolute w-12 h-12 sm:w-14 sm:h-14 border-4 border-t-4 border-${confirmColor??"green"}-600 rounded-full animate-spin`}></div>
          
          {/* Checkmark Icon */}
          <svg
            className={`z-10 text-${confirmColor??"green"}-600`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="28"
            height="28"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Success Message */}
        <h3 className={`text-${confirmColor??"green"}-600 font-semibold text-base sm:text-lg text-center`}>{message}</h3>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full bg-${confirmColor??"green"}-600 hover:bg-${confirmColor??"green"}-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out text-sm sm:text-base`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;