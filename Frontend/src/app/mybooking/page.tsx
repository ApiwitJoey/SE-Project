'use client'
import ReservationCart from "@/components/ReservationCart";
import { useSession } from "next-auth/react";

const MyBookingPage = () => {
  const session = useSession()
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-10">
          <h1 className="text-xl sm:text-3xl font-bold text-emerald-800 mb-1 sm:mb-2">
            {session.data?.user.name}'s Massage Bookings
          </h1>
          <p className="text-sm sm:text-base text-emerald-600 max-w-2xl mx-auto">
            View and manage your upcoming relaxation sessions
          </p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-6 border border-emerald-100">
          <ReservationCart />
        </div>
      </div>
    </main>
  )
}

export default MyBookingPage