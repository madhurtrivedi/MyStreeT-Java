import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { productService } from "../services/api";
import type { Product } from "../types";
import axios from "axios";

// ─── Empty product form ────────────────────────────────────────────────────────
interface ProductForm {
  name: string;
  brand: string;
  description: string;
  price: string;
  imageUrl: string;
  sizesCsv: string;
  stockQty: string;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  imageUrl: "",
  sizesCsv: "",
  stockQty: "",
};

function productToForm(p: Product): ProductForm {
  return {
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: String(p.price),
    imageUrl: p.imageUrl,
    sizesCsv: p.sizesCsv,
    stockQty: String(p.stockQty),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<ProductForm>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch products ───────────────────────────────────────────────────────────
  const fetchProducts = () => {
    setLoading(true);
    productService
      .getAll()
      .then((res) => setProducts(res.data as Product[]))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Dialog helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSaveError(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm(productToForm(p));
    setFormErrors({});
    setSaveError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange =
    (field: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs: Partial<ProductForm> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.brand.trim()) errs.brand = "Brand is required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Enter a valid price.";
    if (!form.stockQty || isNaN(Number(form.stockQty)) || Number(form.stockQty) < 0)
      errs.stockQty = "Enter a valid stock quantity.";
    if (!form.sizesCsv.trim()) errs.sizesCsv = "Enter at least one size (e.g. 7,8,9).";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save (create or update) ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);

    const payload: Partial<Product> = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      sizesCsv: form.sizesCsv.trim(),
      stockQty: Number(form.stockQty),
    };

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      closeDialog();
      fetchProducts();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSaveError(err.response?.data?.message ?? "Failed to save product.");
      } else {
        setSaveError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      // Keep dialog open on error
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px">
              Product Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin · {products.length} products
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{
              bgcolor: "#e8ff00",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#d4eb00" },
            }}
          >
            Add Product
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#e8ff00" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ "& th": { borderColor: "#2a2a2a", color: "#666", fontWeight: 700, fontSize: 12 } }}>
                  <TableCell>IMAGE</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>BRAND</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>SIZES</TableCell>
                  <TableCell>STOCK</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{
                      "& td": { borderColor: "#1a1a1a" },
                      "&:hover": { bgcolor: "#161616" },
                    }}
                  >
                    <TableCell>
                      <Box
                        component="img"
                        src={p.imageUrl}
                        alt={p.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://picsum.photos/seed/fallback/48/48";
                        }}
                        sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {p.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                        {p.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{p.brand}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="#e8ff00">
                        ₹{p.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {p.sizesCsv}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.stockQty}
                        size="small"
                        sx={{
                          bgcolor: p.stockQty > 0 ? "#1a2a1a" : "#2a1a1a",
                          color: p.stockQty > 0 ? "#7dff7d" : "#ff7d7d",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                        <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: "#888" }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(p)}
                          sx={{ color: "#ff5252" }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#111", border: "1px solid #2a2a2a" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Name"
                fullWidth
                required
                value={form.name}
                onChange={handleFormChange("name")}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <TextField
                label="Brand"
                fullWidth
                required
                value={form.brand}
                onChange={handleFormChange("brand")}
                error={!!formErrors.brand}
                helperText={formErrors.brand}
              />
            </Stack>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={handleFormChange("description")}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Price (₹)"
                fullWidth
                required
                type="number"
                value={form.price}
                onChange={handleFormChange("price")}
                error={!!formErrors.price}
                helperText={formErrors.price}
              />
              <TextField
                label="Stock Qty"
                fullWidth
                required
                type="number"
                value={form.stockQty}
                onChange={handleFormChange("stockQty")}
                error={!!formErrors.stockQty}
                helperText={formErrors.stockQty}
              />
            </Stack>
            <TextField
              label="Sizes (comma-separated, e.g. 7,8,9,10)"
              fullWidth
              required
              value={form.sizesCsv}
              onChange={handleFormChange("sizesCsv")}
              error={!!formErrors.sizesCsv}
              helperText={formErrors.sizesCsv}
            />
            <TextField
              label="Image URL"
              fullWidth
              value={form.imageUrl}
              onChange={handleFormChange("imageUrl")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              bgcolor: "#e8ff00",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#d4eb00" },
            }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : editingProduct ? "Save Changes" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { bgcolor: "#111", border: "1px solid #2a2a2a" } }}
      >
        <DialogTitle fontWeight={700}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete{" "}
            <strong style={{ color: "#fff" }}>{deleteTarget?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
