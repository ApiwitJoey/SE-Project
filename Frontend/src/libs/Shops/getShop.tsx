export default async function getShop(id:string){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops/${id}`)

    if(!response.ok){
        throw new Error("Failed to Get shop")
    }

    return await response.json();
}