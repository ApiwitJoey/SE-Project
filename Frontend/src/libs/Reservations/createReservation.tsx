import { CreateReservatinDto } from "../../../interfaces";

export default async function createReservation(shopId:string,token:string|undefined, body:CreateReservatinDto){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops/${shopId}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    // if(!response.ok){
    //     throw new Error("Failed to Create")
    // }

    return await response.json();
}