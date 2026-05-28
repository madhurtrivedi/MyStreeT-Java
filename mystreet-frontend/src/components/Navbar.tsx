import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#0a0a0a",
        borderBottom: "1px solid #1e1e1e",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          fontWeight={900}
          letterSpacing="-0.5px"
          sx={{
            color: "#e8ff00",
            textDecoration: "none",
            flexGrow: { xs: 1, sm: 0 },
            mr: { sm: 4 },
          }}
        >
          MyStreeT
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, flexGrow: 1 }}>
          <Button
            component={RouterLink}
            to="/products"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Sneakers
          </Button>
          {user?.isAdmin && (
            <Button
              component={RouterLink}
              to="/admin/products"
              startIcon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
              sx={{ color: "#e8ff00", fontWeight: 600 }}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Cart icon */}
        <IconButton
          onClick={() => navigate("/cart")}
          sx={{ color: "text.primary" }}
        >
          <Badge badgeContent={totalItems} color="warning" max={99}>
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {/* Auth area */}
        {isAuthenticated ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#e8ff00",
                  color: "#000",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {user?.email?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: { bgcolor: "#111", border: "1px solid #2a2a2a", minWidth: 180 },
              }}
            >
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="body2" noWrap>
                  {user?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                component={RouterLink}
                to="/orders"
                onClick={handleMenuClose}
              >
                My Orders
              </MenuItem>
              {user?.isAdmin && (
                <MenuItem
                  component={RouterLink}
                  to="/admin/products"
                  onClick={handleMenuClose}
                >
                  <AdminPanelSettingsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                  Manage Products
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              sx={{ color: "text.secondary" }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: "#e8ff00",
                color: "#000",
                fontWeight: 700,
                "&:hover": { bgcolor: "#d4eb00" },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
