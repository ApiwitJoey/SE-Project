'use client';

const Modal = ( { isOpen, onClose, children } : { isOpen: boolean, onClose: () => void, children: React.ReactNode}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60" onClick={handleBackdropClick}>
            <div>
                {children}
            </div>
        </div>
  )
}

export default Modal