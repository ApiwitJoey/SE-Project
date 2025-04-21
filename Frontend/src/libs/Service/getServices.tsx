export default async function getAllServices(){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/services`)

    if(!response.ok){
        throw new Error("Failed to Get all services")
    }

    return await response.json();
}