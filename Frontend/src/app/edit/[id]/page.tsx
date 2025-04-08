'use client'
import { useEffect, useState } from "react";
import { Shop, ShopJson, UpdateReservationDto } from "../../../../interfaces";
import dayjs from "dayjs";
import updateReservation from "@/libs/Reservations/updateReservation";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateReservation as updateReservationRedux } from "@/redux/features/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import getShop from "@/libs/Shops/getShop";
import getService from "@/libs/Service/getService";

const EditBookingPage = ({ params }: { params: { id: string } }) => {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const defaultShopId = searchParams.get("shopId") || null;
  const defaultDate = searchParams.get("date") || null;

  const [shops, setShops] = useState<Shop[] | null>(null);

  const { data: session } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (date:string, selectedShopId:string, selectedServiceId: string) => {
    if (!date || !selectedShopId) return;
    
    const reservationId = params.id;
    const selectedShop = await getShop(selectedShopId);
    let selectedService = null;
    if(token){
      selectedService = await getService(selectedServiceId,token);
    }
    
    try {
      if (selectedShop) {
        const updateReduxBody = {
          id: reservationId,
          shop: selectedShop,
          service: selectedService,
          date: dayjs(date).format("YYYY/MM/DD"),
        };
        dispatch(updateReservationRedux(updateReduxBody));
      }

      const body: UpdateReservationDto = {
        shop: selectedShopId,
        service: selectedServiceId,
        date: dayjs(date).format("YYYY/MM/DD"),
      };
      
      await updateReservation(reservationId, token, body);
      router.push("/mybooking");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


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
          <BookingForm onSubmit={handleSubmit} defaultShopId={defaultShopId} defaultDate={defaultDate}/>
        </div>
      </div>
    </div>
  );
};

export default EditBookingPage;