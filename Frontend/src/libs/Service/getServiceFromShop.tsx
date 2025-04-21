export default async function getAllServicesFromShop(shopId: string|null, token:string){
    if(!shopId) {
        throw new Error("shopId can't be null")
    }
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops/${shopId}/services/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Failed to Get all services")
    }

    return await response.json();
}