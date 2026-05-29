import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { orderService, Order } from "../services/orderService";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PLACED: { bg: "#1a2a1a", color: "#7dff7d" },
  PROCESSING: { bg: "#1a1a2a", color: "#7d9fff" },
  SHIPPED: { bg: "#2a1a0a", color: "#ffb07d" },
  DELIVERED: { bg: "#0a2a0a", color: "#00e676" },
  CANCELLED: { bg: "#2a0a0a", color: "#ff5252" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#e8ff00" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Typography
          variant="h5"
          fontWeight={800}
          letterSpacing="-0.5px"
          sx={{ mb: 4 }}
        >
          My Orders
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              color: "text.secondary",
            }}
          >
            <ReceiptLongOutlinedIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
            <Typography variant="h6" color="text.primary" fontWeight={600}>
              No orders yet
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
              Place your first order and it'll show up here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: "#e8ff00",
                color: "#000",
                fontWeight: 700,
                "&:hover": { bgcolor: "#d4eb00" },
              }}
            >
              Shop Now
            </Button>
          </Box>
        )}

        {/* Order list */}
        <Stack spacing={2}>
          {orders.map((order) => {
            const statusStyle =
              STATUS_COLORS[order.status] ?? { bg: "#1a1a1a", color: "#aaa" };

            return (
              <Paper
                key={order.id}
                variant="outlined"
                onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
                sx={{
                  bgcolor: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  p: 2.5,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                  "&:hover": { borderColor: "#e8ff00" },
                }}
              >
                {/* Top row */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 1.5 }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                      Order ID
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ fontFamily: "monospace", fontSize: 13 }}
                    >
                      {order.id}
                    </Typography>
                  </Box>
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                {/* Items preview */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1.5, overflow: "hidden" }}
                >
                  {order.items.slice(0, 3).map((item, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={item.imageUrl}
                      alt={item.productName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://picsum.photos/seed/fallback/48/48";
                      }}
                      sx={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #2a2a2a",
                      }}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        border: "1px solid #2a2a2a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#1a1a1a",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        +{order.items.length - 3}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Bottom row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={800} color="#e8ff00">
                      ₹{order.totalAmount.toFixed(2)}
                    </Typography>
                    <ArrowForwardIosIcon sx={{ fontSize: 12, color: "#555" }} />
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
