import { useQuery } from "@tanstack/react-query";

export interface Category {
    id?: string,
    name: string
}

const API_BASE_URL = "http://localhost:8080/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch(`${API_BASE_URL}/transaction_categories`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to fetch cashflow data");
      return response.json();
    },
  });
};