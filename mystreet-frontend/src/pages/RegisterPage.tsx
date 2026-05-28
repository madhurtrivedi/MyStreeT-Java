import { useState, FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Inline validation ──────────────────────────────────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Enter a valid email address.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm)
      errs.confirm = "Passwords do not match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on edit
    if (fieldErrors[field])
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await authService.register({
        email: form.email,
        password: form.password,
      });

      login({
        userId: data.userId,
        email: data.email,
        isAdmin: data.isAdmin,
        token: data.token,
      });

      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? "Registration failed. Please try again.";
        setError(msg);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Wordmark */}
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing="-1px"
          sx={{ color: "#fff", mb: 0.5 }}
        >
          MyStreeT
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your account to start shopping.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type={showPw ? "text" : "password"}
          fullWidth
          required
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange("password")}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password ?? "Minimum 6 characters"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw((p) => !p)} edge="end">
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Confirm Password"
          type={showPw ? "text" : "password"}
          fullWidth
          required
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange("confirm")}
          error={!!fieldErrors.confirm}
          helperText={fieldErrors.confirm}
          sx={{ mb: 3 }}
        />

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
            letterSpacing: "0.5px",
            "&:hover": { bgcolor: "#d4eb00" },
            mb: 2,
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{" "}
          <RouterLink
            to="/login"
            style={{ color: "#e8ff00", textDecoration: "none", fontWeight: 600 }}
          >
            Sign in
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  );
}
