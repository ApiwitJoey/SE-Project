'use client'
import { useEffect, useState } from "react";
import { ConnectedReservation, ReservationItem } from "../../interfaces";
import getReservations from "@/libs/Reservations/getReservations";
import { AppDispatch } from "@/redux/store";
import { fetchReservation, removeReservation } from "@/redux/features/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import deleteReservation from "@/libs/Reservations/deleteReservation";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchUsers } from "@/redux/features/userSlice";
import getUsers from "@/libs/Users/getUsers";

const ReservationCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    let reservationArr = useSelector((state: RootState) => state.cart.reservationItems);
    const userArr = useSelector((state: RootState) => state.user.user);

    const { data: session } = useSession();
    const token = session?.user.token;
    const [loading, setLoading] = useState(true);

    const connectedReservations = reservationArr.map((reservation) => {
        const userInfo = userArr.find((user) => user._id === reservation.user);
        return {
          ...reservation,
          userName: userInfo ? userInfo.username : "Unknown User",
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const response = await getReservations(token);
                dispatch(fetchReservation(response.data));
            }
            if(userArr.length == 0 && token && session?.user.role == 'admin'){
                const response = await getUsers(token);
                dispatch(fetchUsers(response.data));
            }
            setLoading(false);
        };
        fetchData();
    }, [token, dispatch]);

    const deleteAction = async (id: string, reservationItem: ReservationItem) => {
        try {
            await deleteReservation(id, token);
            dispatch(removeReservation(reservationItem));
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <CircularProgress sx={{ color: '#10b981' }} />
            </div>
        );
    }

    if (reservationArr.length === 0) {
        return (
            <div className="text-center py-8 sm:py-16">
                <div className="text-emerald-700 text-lg sm:text-xl font-medium mb-3 sm:mb-4">No Reservations Found</div>
                <Link href="/booking">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors">
                        Book Your First Session
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {connectedReservations.map((connectedReservation: ConnectedReservation) => (
                <div 
                    className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6 border border-emerald-100 hover:shadow-md transition-shadow" 
                    key={connectedReservation._id}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-emerald-600">Date</p>
                            <p className="text-sm sm:text-base font-medium text-emerald-800">{connectedReservation.date}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-emerald-600">Spa Location</p>
                            <p className="text-sm sm:text-base font-medium text-emerald-800 truncate">
                                {connectedReservation.shop?.name || "Not specified"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-emerald-600">
                                {session?.user.role === 'admin' ? "Client" : "Your Name"}
                            </p>
                            <p className="text-sm sm:text-base font-medium text-emerald-800 truncate">
                                {connectedReservation.userName}
                            </p>
                        </div>

                        {
                             connectedReservation.service ? 
                             <div>
                                 <p className="text-xs sm:text-sm font-bold text-emerald-600">
                                     Service
                                 </p>
                                 <div className="flex flex-col">
                                     <p className="text-sm sm:text-base font-medium text-emerald-800 truncate">
                                         {connectedReservation.service.name}
                                     </p>
                                     <p className="text-xs sm:text-sm font-medium text-emerald-700 truncate">
                                         {connectedReservation.service.details}
                                     </p>
                                     <p className="text-xs sm:text-sm font-bold text-yellow-600">
                                         {'$ ' + connectedReservation.service.price}
                                     </p>
                                 </div>
                             </div>
                             : null
                         }
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-4 mt-3">
                        <button
                            className="px-3 sm:px-5 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-sm sm:justify-start"
                            onClick={() => deleteAction(connectedReservation._id, connectedReservation)}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Cancel
                        </button>
                        <Link href={`edit/${connectedReservation._id}?shopId=${connectedReservation.shop?._id}&date=${connectedReservation.date}`} className="w-full sm:w-auto">
                            <button className="w-full px-3 sm:px-5 py-1.5 sm:py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center justify-center text-sm sm:justify-start">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Reschedule
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReservationCart;