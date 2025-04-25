export default async function unbanUser(id:string, token:string){
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/unban/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Failed to unban user")
    }

    return await response.json();
}