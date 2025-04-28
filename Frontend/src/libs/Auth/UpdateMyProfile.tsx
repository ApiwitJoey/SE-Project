export default async function updateMyProfile(token: string, data: any) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/getme`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: responseData.message || "Profile updated successfully!",
        data: responseData.data, // ในกรณีที่อยากได้ข้อมูล user กลับไปด้วย
      };
    } else {
      return {
        success: false,
        message: responseData.message || "Failed to update profile.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }
}
