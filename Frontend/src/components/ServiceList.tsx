"use client";
import { addService, clearServices } from "@/redux/features/serviceSlice";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import getAllServices from "@/libs/Service/getServices";
import { Service, ServiceJson } from "../../interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function ServiceList() {
    const [allServices, setAllServices] = useState<Service[] | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Get filter params from URL
    const typeFilter = searchParams.get('type') || '';
    const lowerPriceFilter = Number(searchParams.get('lowerprice')) || 0;
    const upperPriceFilter = Number(searchParams.get('upperprice')) || Infinity;

    // Fetch shops only once when component mounts
    useEffect(() => {
        const fetchService = async () => {
            const response: ServiceJson = await getAllServices();
            
            if (response.success) {
                setAllServices(response.data);
                setLoading(false);
            }
        };
        fetchService();
    }, []);

    // Apply filters locally using useMemo
    const filteredServices = useMemo(() => {
        if (!allServices) return [];

        return allServices.filter(service => {
            // 1. Filter by type (ถ้ามี typeFilter)
            if (typeFilter && service.type !== typeFilter) {
                return false;
            }
        
            // 2. Filter by price range (ถ้ามี lower/upperPriceFilter)
            if (lowerPriceFilter && service.price < lowerPriceFilter) {
                return false;
            }
            if (upperPriceFilter && service.price > upperPriceFilter) {
                return false;
            }
        
            return true;
        });
    }, [allServices, typeFilter, lowerPriceFilter, upperPriceFilter]);

    // Update Redux store whenever filtered shops change
    useEffect(() => {
        // Always clear the store first
        dispatch(clearServices());
        
        // Then add the filtered shops
        if (filteredServices.length > 0) {
            filteredServices.forEach((service: Service) => {
                dispatch(addService(service));
            });
        }
    }, [filteredServices, dispatch]);

    // Use shopItems from Redux for rendering
    const serviceItems = useAppSelector((state) => state.service.service);

    if (loading) {
        return (
            <div className="flex justify-center items-center my-auto h-[50vh]">
                <CircularProgress sx={{ color: "#10b981" }} />
            </div>
        );
    }

    return (
        <>
            {serviceItems.length === 0 ? (
                <div className="flex items-center justify-center w-full h-[50vh]">
                    <div className="text-center text-2xl text-emerald-700 font-semibold">
                        No Service Available
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                    {serviceItems.map((serviceItem) => (
                        <div
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100"
                            key={serviceItem._id}
                        >
                            <div className="p-6">
                                <div className="text-xl font-bold text-emerald-800 mb-2">
                                    {serviceItem.name}
                                </div>
                                <div className="space-y-2 text-emerald-700">
                                    <div className="flex items-start">
                                        <svg
                                            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span>{serviceItem.price}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                        {serviceItem.shop?.name || 'No Shop'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}