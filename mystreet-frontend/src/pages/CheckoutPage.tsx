import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  Chip,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCart } from "../context/CartContext";
import { orderService, PlaceOrderPayload } from "../services/orderService";
import axios from "axios";

// ─── Shipping form fields ──────────────────────────────────────────────────────
interface ShippingForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_FORM: ShippingForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<ShippingForm>>({});
  const [paymentMode, setPaymentMode] = useState<"CASH_ON_DELIVERY" | "MOCK_UPI">(
    "CASH_ON_DELIVERY"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to cart if somehow landed here with empty cart
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs: Partial<ShippingForm> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.phone.match(/^\d{10}$/)) errs.phone = "Enter a valid 10-digit phone number.";
    if (!form.addressLine1.trim()) errs.addressLine1 = "Address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.state.trim()) errs.state = "State is required.";
    if (!form.pincode.match(/^\d{6}$/)) errs.pincode = "Enter a valid 6-digit pincode.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange =
    (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field])
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    const shippingAddress = [
      form.fullName,
      form.addressLine1,
      form.addressLine2,
      `${form.city}, ${form.state} - ${form.pincode}`,
      `Phone: ${form.phone}`,
    ]
      .filter(Boolean)
      .join(", ");

    const payload: PlaceOrderPayload = {
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingAddress,
      paymentMode,
    };

    try {
      const { data: order } = await orderService.placeOrder(payload);
      clearCart();
      navigate(`/orders/${order.id}`, { state: { order } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to place order. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        {/* Back */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          sx={{ color: "text.secondary", mb: 3 }}
        >
          Back to Cart
        </Button>

        <Typography
          variant="h5"
          fontWeight={800}
          letterSpacing="-0.5px"
          sx={{ mb: 4 }}
        >
          Checkout
        </Typography>

        <Stack
          component="form"
          onSubmit={handlePlaceOrder}
          noValidate
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="flex-start"
        >
          {/* ── Left: Shipping + Payment ─────────────────────────────────── */}
          <Box sx={{ flex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Shipping */}
            <Paper
              variant="outlined"
              sx={{ bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: 2, p: 3, mb: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <LocalShippingOutlinedIcon sx={{ color: "#e8ff00" }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Shipping Address
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    required
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    error={!!fieldErrors.fullName}
                    helperText={fieldErrors.fullName}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    required
                    inputProps={{ maxLength: 10 }}
                    value={form.phone}
                    onChange={handleChange("phone")}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone}
                  />
                </Stack>

                <TextField
                  label="Address Line 1"
                  fullWidth
                  required
                  value={form.addressLine1}
                  onChange={handleChange("addressLine1")}
                  error={!!fieldErrors.addressLine1}
                  helperText={fieldErrors.addressLine1}
                />

                <TextField
                  label="Address Line 2 (Optional)"
                  fullWidth
                  value={form.addressLine2}
                  onChange={handleChange("addressLine2")}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="City"
                    fullWidth
                    required
                    value={form.city}
                    onChange={handleChange("city")}
                    error={!!fieldErrors.city}
                    helperText={fieldErrors.city}
                  />
                  <TextField
                    label="State"
                    fullWidth
                    required
                    value={form.state}
                    onChange={handleChange("state")}
                    error={!!fieldErrors.state}
                    helperText={fieldErrors.state}
                  />
                  <TextField
                    label="Pincode"
                    fullWidth
                    required
                    inputProps={{ maxLength: 6 }}
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    error={!!fieldErrors.pincode}
                    helperText={fieldErrors.pincode}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Payment */}
            <Paper
              variant="outlined"
              sx={{ bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: 2, p: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PaymentOutlinedIcon sx={{ color: "#e8ff00" }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Payment Method
                </Typography>
                <Chip label="Mock" size="small" sx={{ bgcolor: "#1a1a1a", color: "#666", fontSize: 11 }} />
              </Stack>

              <RadioGroup
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value as "CASH_ON_DELIVERY" | "MOCK_UPI")
                }
              >
                <FormControlLabel
                  value="CASH_ON_DELIVERY"
                  control={<Radio sx={{ color: "#444", "&.Mui-checked": { color: "#e8ff00" } }} />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Cash on Delivery
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pay when your order arrives
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="MOCK_UPI"
                  control={<Radio sx={{ color: "#444", "&.Mui-checked": { color: "#e8ff00" } }} />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Mock UPI
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Simulated UPI payment — always succeeds
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Paper>
          </Box>

          {/* ── Right: Order summary ─────────────────────────────────────── */}
          <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
            <Paper
              variant="outlined"
              sx={{ bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: 2, p: 3 }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Order Summary
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {items.map((item) => (
                  <Stack
                    key={`${item.productId}-${item.size}`}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                        {item.name}
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

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={800} color="#e8ff00">
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: "#e8ff00",
                  color: "#000",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#d4eb00" },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Place Order"
                )}
              </Button>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
