"use client";
import { addShop, clearShops } from "@/redux/features/shopSlice"; // Import clearShops
import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import getAllShops from "@/libs/Shops/getAllShops";
import { Shop, ShopJson } from "../../interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function ShopList() {
    const [allShops, setAllShops] = useState<Shop[] | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Get filter params from URL
    const nameFilter = searchParams.get('name') || '';
    const timeFilter = searchParams.get('time') || '';
    const openTimeFilter = searchParams.get('openTime') || '';
    const closeTimeFilter = searchParams.get('closeTime') || '';

    // Fetch shops only once when component mounts
    useEffect(() => {
        const fetchShop = async () => {
            const response: ShopJson = await getAllShops();
            
            if (response.success) {
                setAllShops(response.data);
                setLoading(false);
            }
        };
        fetchShop();
    }, []);

    // Apply filters locally using useMemo
    const filteredShops = useMemo(() => {
        if (!allShops) return [];

        return allShops.filter(shop => {
            // Filter by name
            if (nameFilter && !shop.name.toLowerCase().includes(nameFilter.toLowerCase())) {
                return false;
            }

            // Filter by time (check if the time is within opening hours)
            if (timeFilter) {
                const time = timeFilter.trim();
                const shopOpenTime = shop.openTime;
                const shopCloseTime = shop.closeTime;
                
                // Simple time comparison (assumes 24-hour format like "08:00")
                if (time < shopOpenTime || time > shopCloseTime) {
                    return false;
                }
            }

            // Add additional filters for openTime and closeTime if needed
            if (openTimeFilter && shop.openTime < openTimeFilter) {
                return false;
            }

            if (closeTimeFilter && shop.closeTime > closeTimeFilter) {
                return false;
            }

            return true;
        });
    }, [allShops, nameFilter, timeFilter, openTimeFilter, closeTimeFilter]);

    // Update Redux store whenever filtered shops change
    useEffect(() => {
        // Always clear the store first
        dispatch(clearShops());
        
        // Then add the filtered shops
        if (filteredShops.length > 0) {
            filteredShops.forEach((shop: Shop) => {
                dispatch(addShop(shop));
            });
        }
    }, [filteredShops, dispatch]);

    // Use shopItems from Redux for rendering
    const shopItems = useAppSelector((state) => state.shop.shop);

    if (loading) {
        return (
            <div className="flex justify-center items-center my-auto h-[50vh]">
                <CircularProgress sx={{ color: "#10b981" }} />
            </div>
        );
    }

    return (
        <>
            {shopItems.length === 0 ? (
                <div className="flex items-center justify-center w-full h-[50vh]">
                    <div className="text-center text-2xl text-emerald-700 font-semibold">
                        No Shops Available
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                    {shopItems.map((shopItem) => (
                        <div
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100"
                            key={shopItem._id}
                        >
                            <div className="p-6">
                                <div className="text-xl font-bold text-emerald-800 mb-2">
                                    {shopItem.name}
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
                                        <span>{shopItem.address}</span>
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
                                            {shopItem.openTime} -{" "}
                                            {shopItem.closeTime}
                                        </span>
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
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span>{shopItem.telephone}</span>
                                    </div>
                                </div>
                                <div className="px-6 pb-6">
                                    <Link href={`/shops/${shopItem._id}`}>
                                        <button className="w-full mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium flex items-center justify-center">
                                            View Details
                                            <svg
                                                className="w-4 h-4 ml-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}