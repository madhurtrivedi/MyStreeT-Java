import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { orderService, Order } from "../services/orderService";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer order passed via navigation state (avoids extra API call)
  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const [order, setOrder] = useState<Order | null>(stateOrder ?? null);
  const [loading, setLoading] = useState(!stateOrder);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stateOrder || !id) return;
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Could not load order details."))
      .finally(() => setLoading(false));
  }, [id, stateOrder]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#e8ff00" }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ textAlign: "center", py: 10, color: "#ff5000" }}>
        <Typography>{error || "Order not found."}</Typography>
        <Button onClick={() => navigate("/orders")} sx={{ mt: 2 }}>
          My Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Success header */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#e8ff00" }} />
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px">
            Order Placed!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your sneakers are on their way.
          </Typography>
          <Chip
            icon={<ReceiptLongOutlinedIcon fontSize="small" />}
            label={`Order ID: ${order.id}`}
            sx={{
              bgcolor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#e8ff00",
              fontWeight: 600,
              fontSize: 12,
              mt: 1,
            }}
          />
        </Stack>

        {/* Order details card */}
        <Paper
          variant="outlined"
          sx={{ bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: 2, p: 3 }}
        >
          {/* Items */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            ITEMS
          </Typography>

          <Stack spacing={2} sx={{ mb: 2 }}>
            {order.items.map((item, idx) => (
              <Stack
                key={idx}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.productName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://picsum.photos/seed/fallback/56/56";
                  }}
                  sx={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 1.5,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size {item.size} × {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Meta */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Payment
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {order.paymentMode === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Mock UPI"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={order.status}
                size="small"
                sx={{ bgcolor: "#1a2a1a", color: "#7dff7d", fontWeight: 700, fontSize: 11 }}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Shipping to
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ maxWidth: 240, textAlign: "right" }}
              >
                {order.shippingAddress}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Total Paid</Typography>
            <Typography fontWeight={800} color="#e8ff00">
              ₹{order.totalAmount.toFixed(2)}
            </Typography>
          </Stack>
        </Paper>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{
              flex: 1,
              bgcolor: "#e8ff00",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#d4eb00" },
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{ flex: 1, borderColor: "#2a2a2a", color: "text.secondary" }}
          >
            My Orders
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
