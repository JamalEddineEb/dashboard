export interface transaction {
    id?: number;
    name: string,
    type: string,
    date: string
    categoryId: number, // Reference to Category entity
    category?: string, // Optional for display purposes (populated by join/lookup)
    amount: number,
    price: number,
    totalValue?: number,
    description?:string
}
