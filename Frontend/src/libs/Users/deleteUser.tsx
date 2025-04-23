export default async function deleteUser(id:string, token:string){
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(!response.ok){
        console.log(response.json);
        throw new Error("Failed to delete user")
    }

    return await response.json();
}