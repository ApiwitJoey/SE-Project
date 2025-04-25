import { ShopJson } from "../../../interfaces";

export default async function getAllShops(queryString: string = ""): Promise<ShopJson> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops${queryString ? `?${queryString}` : ""}`);
    
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