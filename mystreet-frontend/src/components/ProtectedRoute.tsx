import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

/**
 * Wrap any <Route> element with <ProtectedRoute> to require auth.
 * Pass adminOnly={true} for admin-only routes.
 *
 * Usage:
 *   <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
 *   <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    // Authenticated but not admin — send home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
