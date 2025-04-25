export default async function deleteReservation(id:string,token:string|undefined){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
          },
    });

    if(!response.ok){
        throw new Error("Failed to Delete")
    }

    return await response.json();
}