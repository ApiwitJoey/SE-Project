import { CreateServiceDto } from "../../../interfaces";

export default async function createService(shopId: string, token: string, body:CreateServiceDto) {
  
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops/${shopId}/services/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    if(!response.ok){
        throw new Error("Failed to Create service")
    }

    return await response.json();
}