'use client'
import dayjs from "dayjs";
import { useSession } from "next-auth/react"
import { AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux";
import { addReservation } from "@/redux/features/cartSlice"
import { useRouter, useSearchParams } from 'next/navigation';
import createReservation from "@/libs/Reservations/createReservation"
import BookingForm from "@/components/BookingForm"
import { useState } from "react";

const BookingPage = () => {
  const [error, setError] = useState("");
  const { data:session } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultShopId = searchParams.get("shopId") || null;
  const defaultServiceId = searchParams.get("serviceId") || null;
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (date: string, selectedShopId: string, selectedServiceId: string, minTime: any, maxTime: any) => {
    if (dayjs(date).isBefore(dayjs(), 'day')) {
      setError("Cannot select a past date.");
      return;
    }

    if (minTime && maxTime) {
      const selected = dayjs(date);
      if (selected.isBefore(dayjs(minTime)) || selected.isAfter(dayjs(maxTime))) {
        setError("Please select a time within the store's opening hours.");
        return;
      }
    }

    if (!selectedServiceId) {
      setError("You need to select a service");
      return;
    }

    const body = {
      date: dayjs(date).format("YYYY-MM-DDTHH:mm:ss"),
      service: selectedServiceId
    }
    
    if(selectedShopId){
      try {
        const response = await createReservation(selectedShopId, token, body);
        if(response.success){
          dispatch(addReservation(response.data));
          router.push('/mybooking');
        } else {
          setError("Cannot create any more reservations");
        }
      } catch (error) {
        setError("Failed to create reservation. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Book Your Relaxation Session</h1>
          <p className="text-emerald-600">Select your preferred spa and date for a rejuvenating experience</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-emerald-100">
          <BookingForm onSubmit={handleSubmit} defaultShopId={defaultShopId} defaultServiceId={defaultServiceId} />
        </div>
      </div>
    </div>
  )
}

export default BookingPage