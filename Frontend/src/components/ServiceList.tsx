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
    const targetAreaFilter = searchParams.get('targetArea') || '';
    const massageTypeFilter = searchParams.get('massageType') || '';
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
            // 1. Filter by target area
            if (targetAreaFilter && service.targetArea !== targetAreaFilter) {
                return false;
            }
            
            // 2. Filter by massage type
            if (massageTypeFilter && service.massageType !== massageTypeFilter) {
                return false;
            }
        
            // 3. Filter by price range
            if (lowerPriceFilter && service.price < lowerPriceFilter) {
                return false;
            }
            if (upperPriceFilter && service.price > upperPriceFilter) {
                return false;
            }
        
            return true;
        });
    }, [allServices, targetAreaFilter, massageTypeFilter, lowerPriceFilter, upperPriceFilter]);

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
                                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                            />
                                        </svg>
                                        <Link href={`/shops/${serviceItem.shop?._id}`}>
                                            <span className="hover:text-emerald-600 hover:underline transition-all duration-200">
                                                {serviceItem.shop?.name || 'No Shop'}
                                            </span>
                                        </Link>
                                    </div>
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
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        <span>Target Area: {serviceItem.targetArea}</span>
                                    </div>
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
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        <span>Massage Type: {serviceItem.massageType}</span>
                                    </div>
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
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>฿{serviceItem.price}</span>
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