export default async function deleteService(serviceId: string, token: string) {
  
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`
      },
    })

    if(!response.ok){
        throw new Error("Failed to Delete service")
    }

    return await response.json();
}