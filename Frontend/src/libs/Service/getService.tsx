export default async function getService(id:string, token: string){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/services/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Failed to Get service")
    }

    return await response.json();
}