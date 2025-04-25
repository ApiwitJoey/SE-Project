import Link from "next/link";

interface TopMenuItemProps {
  title: string;
  pageRef: string;
  onClick?: () => void; // Make onClick optional
  className?: string;  // Allow for additional custom styling
}

export default function TopMenuItem({ title, pageRef, onClick, className }: TopMenuItemProps) {
  return (
    <Link 
      href={pageRef} 
      className={`mx-2 flex items-center justify-center rounded-md transition-all duration-300
                  hover:bg-emerald-100 hover:rounded-md 
                  focus:outline-2 focus:outline-offset-2 focus:outline-emerald-500 
                  active:bg-emerald-200 
                  text-lg font-medium text-emerald-700 hover:text-emerald-900 
                  border border-transparent hover:border-emerald-200
                  py-2 px-4 shadow-sm
                  group ${className}`} 
      onClick={onClick}  // Attach the onClick handler to the Link component
    >
      <span className="relative">
        {title}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
}
