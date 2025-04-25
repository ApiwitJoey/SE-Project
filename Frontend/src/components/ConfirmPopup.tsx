import { useEffect } from "react";

interface ConfirmationPopupProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
  }
  
const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ title, message, onConfirm, onCancel, confirmColor}) => (




<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
    <p className="text-green-900 text-4xl font-bold">{title}</p>
    <p className="my-2 text-black text-xl">{message}</p>
    <div className="mt-4">
        <button
        onClick={onConfirm}
        className={`mr-2 px-4 py-2 text-white bg-${confirmColor??'red'}-600 hover:bg-${confirmColor??'red'}-700 rounded`}
        >
        Confirm
        </button>
        <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
        Cancel
        </button>
    </div>
    </div>
</div>
);

export default ConfirmationPopup;