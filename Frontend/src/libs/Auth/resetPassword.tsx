export default async function resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/resetpassword/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password : newPassword
      }),
    });
  
    return await response.json();
  }
  