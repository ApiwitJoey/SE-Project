"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";  
import TopMenuItem from "./TopMenuItem";
import { Link } from "@mui/material";


export default function TopMenu() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16 bg-emerald-50 text-emerald-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-6 py-3 bg-white text-emerald-800 shadow-sm z-[20] border-b border-emerald-100 ">
        {/* Left side with auth links and booking links */}
        <div className="hidden md:flex items-center space-x-6">
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
        
        {/* Mobile Hamburger Menu Icon */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="text-emerald-600 hover:text-emerald-800 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
       
        </div>
        
        {/* Right side with navigation links */}
        <div className="hidden md:flex items-center space-x-6">
          {/* <TopMenuItem title="Services" pageRef="/services" /> */}
          <TopMenuItem title="Shops" pageRef="/shops" />
          <TopMenuItem title="Booking" pageRef="/booking" />
          {session?.user.role === "admin" && (
            <TopMenuItem title="Manage Users" pageRef="/users" />
          )}
          <TopMenuItem title="Home" pageRef="/" />
          <TopMenuItem title="Profile" pageRef="/profile" />
        </div>
      </div>
      
      {/* Mobile Menu Dropdown - Sized to ~40% of viewport width and left-aligned */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-3/4 sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-lg z-30 border-r border-b border-emerald-100 animate-slideIn rounded-md">

          <div className="flex flex-col py-2">
            {/* Auth Section */}
            <div className="px-4 py-2 border-b border-emerald-50">
              {session ? (
                <Link 
                  href="/api/auth/signout" 
                  className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center py-2 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/auth/signin2" 
                    className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center py-1 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="text-emerald-600 hover:text-emerald-800 transition font-medium flex items-center py-1 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="px-4 py-1">
              <div className="py-1 hover:bg-emerald-50 transition rounded">
                <TopMenuItem 
                  title="Home" 
                  pageRef="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-sm"
                />
              </div>
              <div className="py-1 hover:bg-emerald-50 transition rounded">
                <TopMenuItem 
                  title="Shops" 
                  pageRef="/shops" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-sm"
                />
              </div>
              <div className="py-1 hover:bg-emerald-50 transition rounded">
                <TopMenuItem 
                  title="Booking" 
                  pageRef="/booking" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-sm"
                />
              </div>
              <div className="py-1 hover:bg-emerald-50 transition rounded">
                {session?.user.role === "admin" ? (
                  <TopMenuItem 
                    title="All Bookings" 
                    pageRef="/mybooking" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-sm"
                  />
                ) : (
                  <TopMenuItem 
                    title="My Bookings" 
                    pageRef="/mybooking" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-sm"
                  />
                )}
              </div>
              {session?.user.role === "admin" && (
                <div className="py-1 hover:bg-emerald-50 transition rounded">
                  <TopMenuItem 
                    title="Manage Users" 
                    pageRef="/users" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-sm"
                  />
                </div>
              )}
              <div className="py-1 hover:bg-emerald-50 transition rounded">
                <TopMenuItem 
                  title="Profile" 
                  pageRef="/profile" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when mobile menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
    </div>
  );
}


