"use client";
import { useSession } from "next-auth/react";
import getShop from "@/libs/Shops/getShop";
import getAllServicesFromShop from "@/libs/Service/getServiceFromShop";
import { useEffect, useState } from "react";
import { Service, ServiceJson, Shop, ShopJson } from "../../../../interfaces";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import ServiceCard from "@/components/ServiceCard";

export default function ShopDetailPage({
    params,
}: {
    params: { sid: string };
}) {
    const { data: session } = useSession();
    const token = session?.user.token;
    const role = session?.user.role;
    const router = useRouter();
    const [shopDetail, setShopDetail] = useState<Shop | null>(null);
    const [services, setServices] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                if (params.sid && token) {
                    const shopDetail = await getShop(params.sid);
                    const shopServices: ServiceJson =
                        await getAllServicesFromShop(params.sid, token);
                    setShopDetail(shopDetail.data);
                    setServices(shopServices.data);
                }
            } catch (error) {
                console.error("Error fetching shop details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [params.sid, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress sx={{ color: "#10b981" }} />
            </div>
        );
    }

    if (!shopDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-emerald-800">
                        Shop not found
                    </h2>
                    <p className="text-emerald-600 mt-2">
                        The requested shop could not be loaded
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-emerald-800 mb-3">
                        {shopDetail.name}
                    </h1>
                    <div className="w-24 h-1 bg-emerald-400 mx-auto"></div>
                </div>

                {/* Shop Information Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                                Shop Details
                            </h2>
                            <div className="space-y-3 text-emerald-800">
                                <p className="flex items-start">
                                    <svg
                                        className="w-5 h-5 mr-2 mt-0.5 text-emerald-600"
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
                                    <span>{shopDetail.address}</span>
                                </p>
                                <p className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-emerald-600"
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
                                    {shopDetail.telephone}
                                </p>
                                <p className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-emerald-600"
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
                                    {shopDetail.openTime} -{" "}
                                    {shopDetail.closeTime}
                                </p>
                            </div>
                        </div>
                        <div>
                            {/* Add shop image here if available */}
                            <div className="bg-emerald-50 rounded-lg h-full flex items-center justify-center">
                                <span className="text-emerald-400">
                                    Shop Image
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                    <div className="flex items-start gap-3">
                        <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
                            Our Services
                        </h2>
                        {
                            role == 'admin' && (
                                <button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2 rounded-xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                                    onClick={() => {
                                        router.push(`/shops/${shopDetail._id}/edit`);
                                    }}
                                >
                                    Edit Shop Services
                                </button>
                            )
                        }
                    </div>
                    {services?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <ServiceCard service={service} isEditable={false}/>
                            ))}
                        </div>
                    ) : (
                        <p className="text-emerald-600 text-center py-8">
                            No services available at this time
                        </p>
                    )}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                        onClick={() => {
                            router.push(`/booking?shopId=${shopDetail._id}`);
                        }}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </main>
    );
}
