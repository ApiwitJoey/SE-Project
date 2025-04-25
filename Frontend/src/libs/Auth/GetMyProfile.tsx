export default async function getMyProfile(token: string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/getme`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to get user profile");
    }
  
    return await response.json(); // { success: true, data: {...} }
  }
  