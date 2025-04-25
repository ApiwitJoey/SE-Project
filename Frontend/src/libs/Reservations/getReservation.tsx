export default async function getReservation(id: string, token: string) {

  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch reservation');
    }
  
    return await response.json();
  }
  