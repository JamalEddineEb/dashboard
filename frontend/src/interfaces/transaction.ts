export interface transaction {
    id?: number;
    name: string,
    type: string,
    date: string
    categoryId: number, // Reference to Category entity
    category?: string,
    amount: number,
    price: number,
    totalValue?: number,
    description?:string
}
