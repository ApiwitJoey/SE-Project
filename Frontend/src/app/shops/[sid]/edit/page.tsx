"use client";
import { useSession } from "next-auth/react";
import getShop from "@/libs/Shops/getShop";
import getAllServicesFromShop from "@/libs/Service/getServiceFromShop";
import { useEffect, useState } from "react";
import { Service, ServiceJson, Shop, CreateServiceDto, UpdateServiceDto } from "../../../../../interfaces";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import EditShopServiceForm from "@/components/EditShopServiceForm";
import createService from "@/libs/Service/createService";
import deleteService from "@/libs/Service/deleteService";
import updateService from "@/libs/Service/updateService";
import Modal from "@/components/Modal";

const EditShopService = ({ params } : { params: { sid: string }}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditedServiceId, setCurrentEditedServiceId] = useState("")
    const [editedError, seteditedError] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState<string>("");

    const { data: session } = useSession();
    const token = session?.user.token;
    const role = session?.user.role;
    const router = useRouter();

    const [shopDetail, setShopDetail] = useState<Shop | null>(null);
    const [services, setServices] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState(true);

    if(role != "admin"){
        router.push('/');
    }

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
            } catch (err) {
                const errMessage = err instanceof Error ? err.message : "Unexpected error occurred";
                setError(errMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, []);

    const addNewService = async ( serviceName:string, price:string, detail:string ) => {
        setError("");
        setSuccess("");
        const parsedPrice = parseFloat(price);

        if(!serviceName){
            setError("Please enter a service name.");
            return;
        }

        if(!price){
            setError("Please enter a price.");
            return;
        }

        if(!detail){
            setError("Please enter the service details.");
            return;
        }

        if(!shopDetail?._id){
            setError("Shop ID not found. Cannot add a new service.");
            return;
        }

        if(!token){
            setError("Token not found. Cannot add a new service.");
            return;
        }

        const body: CreateServiceDto = {
            shop: shopDetail._id,
            name: serviceName,
            price: parsedPrice,
            details: detail
        }
        try {
            const response = await createService(shopDetail?._id, token, body);
            setServices(prevServices => {
                if(!prevServices) return prevServices;
                return [...prevServices, response.data];
            })
            setSuccess("Service added successfully.");
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : "Unexpected error occurred";
            setError(errMessage);
        }
    }

    const handleDelete = async (serviceId: string) => {
        setError("");
        setSuccess("");

        if(!token){
            setError("token not found, can't Add New Service");
            return;
        }

        try {
            await deleteService(serviceId,token);
            setServices(prevServices => {
                if (!prevServices) return prevServices;
                return prevServices.filter(service => service._id !== serviceId);
            });
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : "Unexpected error occurred";
            setError(errMessage);
        }
    }

    const handleEdit = async ( serviceName:string, price:string, detail:string ) => {
        if(!serviceName && !price && !detail){
            seteditedError("Please enter some informatin.");
            return;
        }

        if(!token){
            seteditedError("Token not found. Cannot add a new service.");
            return;
        }

        const body: UpdateServiceDto = {
            name: serviceName || undefined,
            price: price ? parseFloat(price) : undefined,
            details: detail || undefined,
          };

        try {
            const response = await updateService(currentEditedServiceId, token, body);
            setServices(prevServices => {
                if(!prevServices) return prevServices;
                return prevServices.map(service => {
                    if(service._id == currentEditedServiceId){
                        return response.data
                    } 
                    return service
                })
            })
            setIsModalOpen(false);
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : "Unexpected error occurred";
            setError(errMessage);
        }
    };

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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editedError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p className="font-medium">{editedError}</p>
                    </div>
                )}
                <EditShopServiceForm onSubmit={handleEdit} header="Edit Sevice" />
            </Modal>

            <div className="max-w-md mx-auto"> 
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                        <p className="font-medium">{success}</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <EditShopServiceForm onSubmit={addNewService} header="Add New Sevice" />
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="flex items-start gap-3">
                    <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
                        Current Services
                    </h2>
                </div>
                {services?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 hover:shadow-md transition-shadow flex flex-col"
                            >
                                <h3 className="text-xl font-medium text-emerald-800 mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-emerald-700 mb-3">
                                    {service.details}
                                </p>
                                <p className="text-emerald-600 font-bold mb-3">
                                    ฿{service.price}
                                </p>

                                <div className="mt-auto ml-auto flex flex-row gap-2">
                                    <button onClick={(e) => {setIsModalOpen(true); setCurrentEditedServiceId(service._id); seteditedError("");}} className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    
                                    <button onClick={(e) => {handleDelete(service._id)}} className="flex w-fit px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8a1 1 0 001-1V5a1 1 0 00-1-1H8a1 1 0 00-1 1v1z" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-emerald-600 text-center py-8">
                        No services available at this time
                    </p>
                )}
            </div>
        </div>
    </main>
  )
}

export default EditShopService