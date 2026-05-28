import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Redirect back to where the user tried to go (ProtectedRoute preserves it)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await authService.login({
        email: form.email,
        password: form.password,
      });

      login({
        userId: data.userId,
        email: data.email,
        isAdmin: data.isAdmin,
        token: data.token,
      });

      navigate(from, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(err.response?.data?.message ?? "Login failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing="-1px"
          sx={{ color: "#fff", mb: 0.5 }}
        >
          MyStreeT
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to continue.
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
          autoFocus
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type={showPw ? "text" : "password"}
          fullWidth
          required
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw((p) => !p)} edge="end">
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don't have an account?{" "}
          <RouterLink
            to="/register"
            style={{ color: "#e8ff00", textDecoration: "none", fontWeight: 600 }}
          >
            Register
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  );
}
