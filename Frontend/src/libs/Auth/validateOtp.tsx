export default async function validateOtp(otp:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/validate-otp/${otp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return await response.json();
  };
  