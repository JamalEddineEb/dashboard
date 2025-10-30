import { fetchWithAuth } from "@/utilities/api";
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
      const response = await fetchWithAuth(`${API_BASE_URL}/transaction_categories`, {
        method: 'GET',
      });
      return response
    },
  });
};