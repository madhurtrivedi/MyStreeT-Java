import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          color: "text.secondary",
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 72, opacity: 0.3 }} />
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Your cart is empty
        </Typography>
        <Typography variant="body2">
          Add some sneakers to get started.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{
            mt: 1,
            bgcolor: "#e8ff00",
            color: "#000",
            fontWeight: 700,
            "&:hover": { bgcolor: "#d4eb00" },
          }}
        >
          Browse Products
        </Button>
      </Box>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px" sx={{ mb: 3 }}>
        My Cart{" "}
        <Chip
          label={totalItems}
          size="small"
          sx={{ bgcolor: "#e8ff00", color: "#000", fontWeight: 700, ml: 1 }}
        />
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
        {/* ── Item list ─────────────────────────────────────────────────────── */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper
                key={`${item.productId}-${item.size}`}
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  bgcolor: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://picsum.photos/seed/fallback/80/80";
                  }}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1.5,
                    flexShrink: 0,
                  }}
                />

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    noWrap
                    sx={{ mb: 0.25 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.brand} · Size {item.size}
                  </Typography>
                  <Typography variant="body2" color="#e8ff00" fontWeight={600} sx={{ mt: 0.5 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>

                {/* Quantity stepper */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                    sx={{ border: "1px solid #333", borderRadius: 1 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ minWidth: 24, textAlign: "center" }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                    sx={{ border: "1px solid #333", borderRadius: 1 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Remove */}
                <IconButton
                  color="error"
                  onClick={() => removeItem(item.productId, item.size)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* ── Order summary ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flexShrink: 0,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Order Summary
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {items.map((item) => (
                <Stack
                  key={`${item.productId}-${item.size}`}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 170 }}>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#e8ff00">
                ₹{totalPrice.toFixed(2)}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/checkout")}
              sx={{
                bgcolor: "#e8ff00",
                color: "#000",
                fontWeight: 700,
                "&:hover": { bgcolor: "#d4eb00" },
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              fullWidth
              size="small"
              onClick={() => navigate("/products")}
              sx={{ mt: 1.5, color: "text.secondary" }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
