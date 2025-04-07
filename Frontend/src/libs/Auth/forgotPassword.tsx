export default async function forgotPassword(userEmail:string){
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/forgotpassword`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            email: userEmail,
        })
    });

    if (response.status === 500) {
        throw new Error("Internal Server Error");
    }

    return await response.json();
}