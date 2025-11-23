export interface Cart {
  id: string;
  userId: string;
  items: { name: string; price: number }[];
  totalAmount: number;      
  currency: string;
}