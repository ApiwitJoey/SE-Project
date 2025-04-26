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
import ServiceCard from "@/components/ServiceCard";
import { PrevInfo } from "@/components/EditShopServiceForm";
import SuccessPopup from "@/components/SuccessPopup";

const EditShopService = ({ params } : { params: { sid: string }}) => {
    const [prevInfo, setPrevInfo] = useState<PrevInfo | undefined>(undefined);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditedServiceId, setCurrentEditedServiceId] = useState("")
    const [editedError, seteditedError] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState<string>("");
    const [showEditSuccessPopup, setShowEditSuccessPopup] = useState(false); 
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false); 

    const { data: session } = useSession();
    const token = session?.user.token;
    const role = session?.user.role;
    const router = useRouter();

    const [shopDetail, setShopDetail] = useState<Shop | null>(null);
    const [services, setServices] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState(true);

    if(role != "admin" || !token){
        router.push('/auth/signin2');
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

    const addNewService = async ( serviceName:string, price:string, detail:string, targetArea:string, massageType:string ) => {
        setError("");
        setSuccess("");
        const parsedPrice = parseFloat(price);

        if(parsedPrice < 0){
            setError("Price cannot be negative. Please enter a valid amount.");
            return;
        }

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

        if(!targetArea){
            setError("Please select a target area.");
            return;
        }

        if(!massageType){
            setError("Please select a massage type.");
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
            targetArea: targetArea,
            massageType: massageType,
            details: detail
        }
        try {
            const response = await createService(shopDetail?._id, token, body);
            setServices(prevServices => {
                if(!prevServices) return prevServices;
                return [...prevServices, response.data];
            })
            console.log(services)
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
            setShowDeleteSuccessPopup(true);
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : "Unexpected error occurred";
            setError(errMessage);
        }
    }

    const handleEdit = async ( serviceName:string, price:string, detail:string, targetArea:string, massageType:string ) => {
        setError("");
        setSuccess("");
        if(!currentEditedServiceId){
            seteditedError("No service selected for editing.");
            return;
        }

        if(!serviceName && !price && !detail && !targetArea && !massageType){
            seteditedError("Please enter some information.");
            return;
        }

        if (
            prevInfo &&
            prevInfo.serviceName === serviceName &&
            prevInfo.price === price &&
            prevInfo.detail === detail &&
            prevInfo.targetArea === targetArea &&
            prevInfo.massageType === massageType
        ){
            seteditedError("No changes made to the service.");
            return;
        };

        if(!token){
            seteditedError("Token not found. Cannot add a new service.");
            return;
        }

        const body: UpdateServiceDto = {
            name: serviceName || undefined,
            price: price ? parseFloat(price) : undefined,
            details: detail || undefined,
            targetArea: targetArea || undefined,
            massageType: massageType || undefined
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
            setShowEditSuccessPopup(true);
            setPrevInfo(undefined);
            setCurrentEditedServiceId("");
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
                <EditShopServiceForm onSubmit={handleEdit} header="Edit Sevice" prevInfo={prevInfo} />
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
                            <ServiceCard 
                                service={service} 
                                isEditable={true} 
                                editOnclick={() => {setCurrentEditedServiceId(service._id); seteditedError(""); setPrevInfo({
                                    serviceName: service.name,
                                    price: service.price.toString(),
                                    detail: service.details,
                                    targetArea: service.targetArea,
                                    massageType: service.massageType
                                }); setIsModalOpen(true);}}
                                deleteOnclick={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-emerald-600 text-center py-8">
                        No services available at this time
                    </p>
                )}
            </div>
            {showEditSuccessPopup && (
                <SuccessPopup
                    message="Service updated successfully!"
                    onClose={() => setShowEditSuccessPopup(false)} // Close the success popup
                />
            )}
            {showDeleteSuccessPopup && (
                <SuccessPopup
                    message="Service deleted successfully!"
                    onClose={() => setShowDeleteSuccessPopup(false)} // Close the success popup
                    confirmColor="red"
                />
            )}
        </div>
    </main>
  )
}

export default EditShopService