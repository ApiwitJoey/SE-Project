export default async function updateMyProfile(token: string, data: any) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/getme`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  return await response.json();
}
