// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchWithAuth } from '../utilities/api';

// export const useTransactions = (categoryId?: string, type?: string) => {
//   const params = new URLSearchParams();

//   if (categoryId && categoryId !== "all") {
//     params.append("categoryId", categoryId);
//   }

//   if (type && type !== "all") {
//     params.append("type", type);
//   }

//   const url = `${API_BASE_URL}?${params.toString()}`;

//   return useQuery({
//     queryKey: ['transactions', categoryId, type], 
//     queryFn: async (): Promise<User> => fetchWithAuth('http://localhost:8080/api/users/me', {
//       method: 'GET',
//     }),
//   });
// };

// export default Profile;
