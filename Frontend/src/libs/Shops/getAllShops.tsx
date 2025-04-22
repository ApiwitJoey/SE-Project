import { ShopJson } from "../../../interfaces";

export default async function getAllShops(queryString: string = ""): Promise<ShopJson> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(`${apiUrl}/shops${queryString ? `?${queryString}` : ""}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching shops:", error);
    return {
      success: false,
      count: 0,
      data: [],
    };
  }
}