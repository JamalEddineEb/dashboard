export interface Category {
  id?: number;
  name: string;
  description?: string;
  type: string;
  color?: string; // For UI styling/grouping
  createdAt?: string;
  updatedAt?: string;
}
