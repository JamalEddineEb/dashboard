import { fetchWithAuth } from "../utilities/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:8080/api";

interface AddCategoryData {
  name: string;
}

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCategoryData) => {
      const response = await fetch(`${API_BASE_URL}/transaction_categories`, {
        method: 'POST',
        credentials: 'include',  // important for cookies/session
        mode: 'cors',
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // must match backend expected payload
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('POST failed:', response.status, errorText);
        throw new Error('Failed to add category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};


export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(`${API_BASE_URL}/transaction_categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
