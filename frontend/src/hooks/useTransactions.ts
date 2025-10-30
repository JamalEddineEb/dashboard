import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../utilities/api"

export interface Transaction {
  name: string;
  id: string;
  type: "income" | "expense";
  amount: number;
  price: number;
  totalValue?: number;
  category?: string;
  categoryId?: string;
  description: string;
  date: string;
}

const API_BASE_URL = "http://localhost:8080/api/transactions";

export const useTransactions = (categoryId?: string, type?: string) => {
  const params = new URLSearchParams();

  if (categoryId && categoryId !== "all") {
    params.append("categoryId", categoryId);
  }

  if (type && type !== "all") {
    params.append("type", type);
  }

  const url = `${API_BASE_URL}?${params.toString()}`;

  return useQuery({
    queryKey: ['transactions', categoryId, type], 
    queryFn: async (): Promise<Transaction[]> => fetchWithAuth(url, {
      method: 'GET',
    }),
  });

  // return useQuery({
  //   queryKey: ["transactions", categoryId, type], 
  //   queryFn: async (): Promise<Transaction[]> => {
  //     const response = await fetch(url, {
  //       method: 'GET',
  //       credentials: 'include',
  //     });
  //     if (!response.ok) throw new Error("Failed to fetch transactions");
  //     return response.json();
  //   },
  // });
};





export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id">) => {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error("Failed to add transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok){        
        throw new Error("Failed to delete transaction");
      } 
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
