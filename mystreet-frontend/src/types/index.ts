export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  sizesCsv: string;
  stockQty: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ApiError {
  timestamp: string;
  path: string;
  error: string;
  message: string;
}
