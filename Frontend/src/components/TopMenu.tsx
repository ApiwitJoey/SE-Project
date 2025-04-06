"use client"
import { useSession } from "next-auth/react";  
import TopMenuItem from "./TopMenuItem";
import { Link } from "@mui/material";

export default function TopMenu() {
  const { data: session, status } = useSession();  

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16 bg-emerald-50 text-emerald-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white text-emerald-800 shadow-sm z-[20] border-b border-emerald-100">
      <div className="flex items-center space-x-6">
      {session ? (
          <Link 
            href="/api/auth/signout" 
            className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out from {session.user.name}
          </Link>
        ) : (
          <Link 
            href="/auth/signin2" 
            className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        )}
        {
          session ? "" :
        <Link 
            href="/auth/signup" 
            className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center"
          >
            <svg 
            className="w-5 h-5 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
            />
          </svg>
            Sign Up
        </Link>
        }
        {session?.user.role === "admin" ? (
          <TopMenuItem title="All Bookings" pageRef="/mybooking" />
        ) : (
          <TopMenuItem title="My Bookings" pageRef="/mybooking" />
        )}

        
      </div>
      
      <div className="flex items-center space-x-6">
        <TopMenuItem title="Shops" pageRef="/shops" />
        <TopMenuItem title="Booking" pageRef="/booking" />
        {session?.user.role === "admin" && (
          <TopMenuItem title="Manage Users" pageRef="/users" />
        )}
        <TopMenuItem title="Home" pageRef="/" />
        <TopMenuItem title="Profile" pageRef="/profile" />
      </div>
    </div>
  );
}