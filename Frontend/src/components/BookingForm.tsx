'use client'
import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import getAllShops from "@/libs/Shops/getAllShops";
import getAllServicesFromShop from "@/libs/Service/getServiceFromShop";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ServiceJson, Shop, ShopJson } from "../../interfaces";
import { Service } from "../../interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import { useSession } from "next-auth/react";

const BookingForm = ({ onSubmit, defaultShopId, defaultDate }: { onSubmit: Function, defaultShopId?: string | null, defaultDate?: string | null }) => {

    const [shops, setShops] = useState<Shop[] | null>(null);
    const [services, setServices] = useState<Service[] | null>(null);
    const [serviceId, setServiceId] = useState<string | null>(null);
    const [selectedShopId, setSelectedShopId] = useState<string | null>(defaultShopId || null);
    const [date, setDate] = useState<Dayjs | null>(null);

    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const token = session?.user.token;

    const fetchService = async (ShopId?:string) => {
        if((selectedShopId || ShopId) && token){
            const response: ServiceJson = ShopId ? await getAllServicesFromShop(ShopId,token) : await getAllServicesFromShop(selectedShopId,token);
            if (response.success && response.data.length > 0) {
                setServices(response.data);
                setServiceId(response.data[0]._id)
                setLoading(false);
            }
            if(response.data.length == 0){
                setServices(null);
                setServiceId(null);
            }
        }
    };
    
    useEffect(() => {
        const fetchShop = async () => {
            const response: ShopJson = await getAllShops();
            if (response.success) {
                setShops(response.data);
                if (!defaultShopId && response.data.length > 0) {
                    setSelectedShopId(response.data[0]._id);
                    await fetchService(response.data[0]._id);
                }
                else if(defaultShopId){
                    await fetchService(defaultShopId)
                }

                setLoading(false);
            }
        };
        fetchShop();
        if (defaultDate) {
            // console.log(defaultDate)
            const defaultDateObj = dayjs(defaultDate, "YYYY/MM/DD");
            setDate(defaultDateObj);
        }
    }, []);

    useEffect(() => {
        if(selectedShopId){
            fetchService(selectedShopId);
        }
    }, [selectedShopId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <CircularProgress sx={{ color: '#10b981' }} />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-emerald-100 my-6">
            <h1 className="text-2xl font-bold text-emerald-800 mb-6">Book Your Massage</h1>
            <form className="space-y-6">
                <div>
                    <label htmlFor="shop" className="block text-emerald-700 font-medium mb-2">
                        Select Spa Location:
                    </label>
                    <Select
                        labelId="shop-select-label"
                        id="shop-select"
                        value={selectedShopId}
                        onChange={(e) => setSelectedShopId(e.target.value as string)}
                        className="w-full bg-white text-emerald-900 rounded-lg"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#059669',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#047857',
                            },
                        }}
                    >
                        {shops?.map((shop) => (
                            <MenuItem 
                                key={shop._id} 
                                value={shop._id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#d1fae5',
                                    },
                                }}
                            >
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {shop.name}
                                </div>
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                    {
                        services && services.length > 0 ? 
                        <div>
                        <label htmlFor="shop" className="block text-emerald-700 font-medium mb-2">
                            Select Spa Service:
                        </label>
                        <Select
                            labelId="shop-select-label"
                            id="shop-select"
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value as string)}
                            className="w-full bg-white text-emerald-900 rounded-lg"
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#059669',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#047857',
                                },
                            }}
                        >
                            {services?.map((service) => (
                                <MenuItem 
                                    key={service._id} 
                                    value={service._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#d1fae5',
                                        },
                                    }}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {service.name} : {service.details}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        </div>
                         : null
                    }
                
                <div>
                    <label className="block text-emerald-700 font-medium mb-2">
                        Select Date:
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            className="w-full"
                            value={date} 
                            onChange={(newDate) => setDate(newDate)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#059669',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#047857',
                                    },
                                },
                                width: '100%'
                            }}
                        />
                    </LocalizationProvider>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition duration-300 font-medium flex items-center justify-center"
                    onClick={(e) => { e.preventDefault(); onSubmit(date, selectedShopId, serviceId); }}
                >
                    Confirm Booking
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default BookingForm;