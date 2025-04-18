"use client";
import { useSession } from "next-auth/react";
import getShop from "@/libs/Shops/getShop";
import getAllServicesFromShop from "@/libs/Service/getServiceFromShop";
import { useEffect, useState } from "react";
import { Service, ServiceJson, Shop, CreateServiceDto } from "../../../../../interfaces";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import EditShopServiceForm from "@/components/EditShopServiceForm";
import createService from "@/libs/Service/createService";

const EditShopService = ({ params } : { params: { sid: string }}) => {
    const [error, setError] = useState("");
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
            } catch (error) {
                console.error("Error fetching shop details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [params.sid, token]);

    const addNewService = async ( serviceName:string, price:string, detail:string ) => {
        const parsedPrice = parseFloat(price);

        if(!shopDetail?._id){
            setError("shopId not found, can't Add New Service");
            console.log("shopId not found");
            return;
        }

        if(!token){
            setError("token not found, can't Add New Service");
            console.log("token not found");
            return;
        }

        const body: CreateServiceDto = {
            shop: shopDetail._id,
            name: serviceName,
            price: parsedPrice,
            details: detail
        }
        try {
            setLoading(true);
            const response = await createService(shopDetail?._id, token, body);
            const shopServices: ServiceJson =
                        await getAllServicesFromShop(params.sid, token);
            setServices(shopServices.data);
        } catch (error) {
            setError("Failed to Create service");
        } finally {
            setLoading(false);
        }
    }

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

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        <EditShopServiceForm onSubmit={addNewService}/>

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
                            className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-medium text-emerald-800 mb-2">
                                {service.name}
                            </h3>
                            <p className="text-emerald-700 mb-3">
                                {service.details}
                            </p>
                            <p className="text-emerald-600 font-bold">
                                ฿{service.price}
                            </p>
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