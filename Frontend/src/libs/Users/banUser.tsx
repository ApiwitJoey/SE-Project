export default async function banUser(id:string, token:string){
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/ban/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Failed to ban user")
    }

    return await response.json();
}