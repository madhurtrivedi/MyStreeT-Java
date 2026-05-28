import axios from "axios";

// ─── Axios instance ────────────────────────────────────────────────────────────
// baseURL intentionally empty — Vite proxy forwards /api → :8080
const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — attach Bearer token if present ─────────────────────
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("mystreet_auth");
    if (stored) {
      const { token } = JSON.parse(stored) as { token: string };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // storage parse failure — continue without token
  }
  return config;
});

// ─── Response interceptor — handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth and redirect to login
      localStorage.removeItem("mystreet_auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth service calls ───────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  isAdmin: boolean;
}

export const authService = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>("/api/auth/register", data),

  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/api/auth/login", data),
};

// ─── Product service calls (unchanged from Sprint 1, included for completeness) ─

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  sizesCsv: string;
  stockQty: number;
}

export const productService = {
  getAll: (brand?: string, size?: string) => {
    const params: Record<string, string> = {};
    if (brand) params.brand = brand;
    if (size) params.size = size;
    return api.get<Product[]>("/api/products", { params });
  },

  getById: (id: string) => api.get<Product>(`/api/products/${id}`),

  // Admin only
  create: (data: Partial<Product>) => api.post<Product>("/api/products", data),
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/api/products/${id}`, data),
  delete: (id: string) => api.delete(`/api/products/${id}`),
};
