import { UpdateServiceDto } from "../../../interfaces";

export default async function updateService(serviceId: string, token: string, body: UpdateServiceDto) {
  
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/services/${serviceId}`, {
      method: 'PUT',
      headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    if(!response.ok){
        throw new Error("Failed to Update service")
    }

    return await response.json();
}