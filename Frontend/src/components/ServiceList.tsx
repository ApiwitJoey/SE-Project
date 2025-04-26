"use client";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import getAllServices from "@/libs/Service/getServices";
import { Service, ServiceJson } from "../../interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Pagination from "@mui/material/Pagination";
import BodyPart from "./iconTargetArea";
import MassageType from "./iconMassageType";

export default function ServiceList() {
    const [allServices, setAllServices] = useState<Service[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Get filter params from URL
    const nameFilter = searchParams.get('name') || '';
    const targetAreaFilter = searchParams.get('targetArea') || '';
    const massageTypeFilter = searchParams.get('massageType') || '';
    const lowerPriceFilter = Number(searchParams.get('lowerprice')) || 0;
    const upperPriceFilter = Number(searchParams.get('upperprice')) || Infinity;
    const sortBy = searchParams.get('sortBy') || '';

    // Fetch services when search params change
    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            const response: ServiceJson = await getAllServices();
            
            if (response.success) {
                setAllServices(response.data);
                setLoading(false);
            }
        };
        fetchService();
    }, [searchParams]); // Add searchParams as dependency

    // Apply filters locally using useMemo
    const filteredServices = useMemo(() => {
        if (!allServices) return [];

        let filtered = allServices.filter(service => {
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

            // 4. Filter by name
            if (nameFilter && !service.name.toLowerCase().includes(nameFilter.toLowerCase())) {
                return false;
            }
        
            return true;
        });

        // Sort by price if sortBy is specified
        if (sortBy === 'asc') {
            filtered.sort((a, b) => a.price - b.price); // Low to High
        } else if (sortBy === 'desc') {
            filtered.sort((a, b) => b.price - a.price); // High to Low
        }

        return filtered;
    }, [allServices, nameFilter, targetAreaFilter, massageTypeFilter, lowerPriceFilter, upperPriceFilter, sortBy]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [nameFilter, targetAreaFilter, massageTypeFilter, lowerPriceFilter, upperPriceFilter, sortBy]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentServices = filteredServices.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center my-auto h-[50vh]">
                <CircularProgress sx={{ color: "#10b981" }} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {currentServices.length === 0 ? (
                <div className="flex items-center justify-center w-full h-[50vh]">
                    <div className="text-center text-2xl text-emerald-700 font-semibold">
                        No Service Available
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 w-full max-w-7xl mx-auto">
                        {currentServices.map((serviceItem) => (
                            serviceItem.shop?._id ?
                            <div
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100 flex flex-col"
                                key={serviceItem._id}
                            >
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xl font-bold text-emerald-800 mb-4 line-clamp-1">
                                        {serviceItem.name}
                                    </div>
                                    <div className="space-y-3 text-emerald-700 flex-grow">
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
                                            <Link href={`/shops/${serviceItem.shop?._id}`} className="line-clamp-1">
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
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="font-semibold"> {serviceItem.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-start">
                                                <span>
                                                    {serviceItem.details}
                                                </span>
                                        </div>
                                        <div className="flex flex-wrap items-start gap-2">
                                            <BodyPart name={serviceItem.targetArea} />
                                            <MassageType name={serviceItem.massageType} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <Link 
                                            href={`/booking?shopId=${serviceItem.shop._id}&serviceId=${serviceItem._id}`}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 w-1/2 text-center"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            Book Now
                                        </Link>
                                    </div> 
                                </div>
                            </div> : null
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination 
                            count={totalPages} 
                            page={currentPage} 
                            onChange={handlePageChange}
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#10b981',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#10b981 !important',
                                    color: 'white !important',
                                },
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}