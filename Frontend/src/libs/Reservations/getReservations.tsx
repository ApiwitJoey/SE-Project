export default async function getReservations(token:string){

    
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations`, {
        method: 'GET', // default method is GET, you can omit this if it's GET
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
        },
        next: { tags: ['reservations'] }
      });


    if(!response.ok){
        throw new Error('Failed to fetch reservations')
    }

    return await response.json();
}