import { UpdateReservationDto } from "../../../interfaces";

export default async function updateReservation(id:string,token:string|undefined, body:UpdateReservationDto){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if(!response.ok){
        throw new Error("Failed to Update")
    }

    return await response.json();
}