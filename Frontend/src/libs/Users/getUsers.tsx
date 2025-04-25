export default async function getUsers(token:string){
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Failed to Get all users")
    }

    return await response.json();
}