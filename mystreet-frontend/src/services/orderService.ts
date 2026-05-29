import api from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItemPayload {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  shippingAddress: string;
  paymentMode: "CASH_ON_DELIVERY" | "MOCK_UPI";
}

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  shippingAddress: string;
  paymentMode: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const orderService = {
  placeOrder: (payload: PlaceOrderPayload) =>
    api.post<Order>("/api/orders", payload),

  getMyOrders: () => api.get<Order[]>("/api/orders/mine"),

  getOrderById: (id: string) => api.get<Order>(`/api/orders/${id}`),
};
