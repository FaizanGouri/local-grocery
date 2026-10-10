import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import {
  FiPackage, FiPlusCircle, FiList, FiShoppingBag,
  FiUpload, FiEdit2, FiTrash2, FiLogOut, FiCheck,
  FiX, FiAlertCircle, FiTrendingUp,
} from "react-icons/fi";

/* ─── Variants ───────────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Status Config ──────────────────────────────────────── */
const STATUS = {
  processing:        { label: "Processing",       bg: "#FAEEDA", color: "#854F0B", icon: "⏳" },
  shipped:           { label: "Shipped",           bg: "#E6F1FB", color: "#185FA5", icon: "🚚" },
  "out-for-delivery":{ label: "Out for delivery",  bg: "#E1F5EE", color: "#0F6E56", icon: "📍" },
  delivered:         { label: "Delivered",         bg: "#EAF3DE", color: "#3B6D11", icon: "✅" },
  cancelled:         { label: "Cancelled",         bg: "#FCEBEB", color: "#A32D2D", icon: "✕" },
};

const CATEGORIES = [
  "Fruits", "Vegetables", "Dairy", "Bakery",
  "Drinks", "Instant", "Grains", "Oils",
  "Beverages", "Snacks", "Meat", "Other",
];

/* ─── Toast ──────────────────────────────────────────────── */
const Toast = ({ msg, type = "success" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "fixed", bottom: "2rem", left: "50%",
      transform: "translateX(-50%)",
      background: type === "success" ? "#0F6E56" : "#A32D2D",
      color: "#fff", padding: "10px 20px",
      borderRadius: 100, fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 8,
      zIndex: 9999, whiteSpace: "nowrap",
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    }}
  >
    {type === "success" ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
    {msg}
  </motion.div>
);

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <motion.div
    variants={fadeUp}
    style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      padding: "1.1rem 1.25rem",
      display: "flex", alignItems: "center", gap: 14,
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: accent + "18",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon size={20} color={accent} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 11, color: "#888780", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, color: "#2C2C2A" }}>{value}</p>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   TAB 1 — ADD PRODUCT
══════════════════════════════════════════════════════════ */
const AddProduct = ({ onAdd, showToast, axios }) => {
  const fileRef = useRef();
  const empty = {
    name: "", category: "Fruits", description: "",
    price: "", offerPrice: "", unit: "kg", inStock: true,
  };
  const [form, setForm]       = useState(empty);
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!image)                                                        e.image       = "Product image is required";
    if (!form.name.trim())                                             e.name        = "Product name is required";
    if (!form.description.trim())                                      e.description = "Description is required";
    if (!form.price || isNaN(form.price) || +form.price <= 0)         e.price       = "Valid price is required";
    if (!form.offerPrice || isNaN(form.offerPrice) || +form.offerPrice <= 0) e.offerPrice = "Valid offer price is required";
    if (+form.offerPrice > +form.price)                                e.offerPrice  = "Offer price must be ≤ original price";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      const productData = {
        name:        form.name.trim(),
        description: form.description.split('\n'),
        category:    form.category,
        price:       +form.price,
        offerPrice:  +form.offerPrice,
        unit:        form.unit,
        inStock:     form.inStock,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      formData.append('images', image);

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        showToast("Product added successfully!");
        // ✅ onAdd ko call karo — parent state update hogi
        onAdd({
          ...productData,
          _id:     Date.now().toString(),
          image:   [preview],
          addedAt: new Date().toLocaleDateString("en-IN"),
        });
        setForm(empty);
        setImage(null);
        setPreview(null);
      } else {
        showToast(data.message || "Failed to add product", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message, "error");
    }

    setLoading(false);
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${err ? "#E24B4A" : "rgba(0,0,0,0.12)"}`,
    borderRadius: 12, fontSize: 14, outline: "none",
    fontFamily: "inherit", color: "#2C2C2A",
    background: err ? "#FCEBEB" : "#fff",
    boxSizing: "border-box", transition: "border-color 0.18s",
  });

  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: "#5F5E5A",
    display: "block", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.06em",
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger} initial="hidden" animate="show"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      {/* Image Upload */}
      <motion.div variants={fadeUp}>
        <label style={labelStyle}>Product Image *</label>
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${errors.image ? "#E24B4A" : preview ? "#1D9E75" : "rgba(0,0,0,0.15)"}`,
            borderRadius: 16, padding: "1.5rem",
            cursor: "pointer", textAlign: "center",
            background: preview ? "#F8FAF9" : "#FAFAF9",
            transition: "all 0.2s",
          }}
        >
          {preview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={preview} alt="preview"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                style={{
                  position: "absolute", top: -8, right: -8,
                  background: "#E24B4A", color: "#fff",
                  border: "none", borderRadius: "50%",
                  width: 22, height: 22, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FiX size={12} />
              </button>
            </div>
          ) : (
            <>
              <FiUpload size={28} color="#1D9E75" style={{ marginBottom: 8 }} />
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A", fontWeight: 600 }}>
                Click to upload image
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#B4B2A9" }}>
                PNG, JPG up to 5MB
              </p>
            </>
          )}
        </div>
        {errors.image && <p style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{errors.image}</p>}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
      </motion.div>

      {/* Name + Category */}
      <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={labelStyle}>Product Name *</label>
          <input
            value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="e.g. Fresh Alphonso Mangoes"
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            value={form.category} onChange={e => set("category", e.target.value)}
            style={{ ...inputStyle(false), appearance: "none" }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeUp}>
        <label style={labelStyle}>Description *</label>
        <textarea
          value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Describe your product — freshness, origin, quality..."
          rows={3}
          style={{ ...inputStyle(errors.description), resize: "vertical" }}
        />
        {errors.description && <p style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{errors.description}</p>}
      </motion.div>

      {/* Price + Offer Price + Unit */}
      <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div>
          <label style={labelStyle}>Original Price (₹) *</label>
          <input
            type="number" min="1" value={form.price}
            onChange={e => set("price", e.target.value)}
            placeholder="199"
            style={inputStyle(errors.price)}
          />
          {errors.price && <p style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{errors.price}</p>}
        </div>
        <div>
          <label style={labelStyle}>Offer Price (₹) *</label>
          <input
            type="number" min="1" value={form.offerPrice}
            onChange={e => set("offerPrice", e.target.value)}
            placeholder="149"
            style={inputStyle(errors.offerPrice)}
          />
          {errors.offerPrice && <p style={{ color: "#A32D2D", fontSize: 12, marginTop: 4 }}>{errors.offerPrice}</p>}
        </div>
        <div>
          <label style={labelStyle}>Unit</label>
          <select value={form.unit} onChange={e => set("unit", e.target.value)}
            style={{ ...inputStyle(false), appearance: "none" }}
          >
            {["kg","g","litre","ml","dozen","piece","pack"].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </motion.div>

      {/* In Stock Toggle */}
      <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          onClick={() => set("inStock", !form.inStock)}
          style={{
            width: 44, height: 24, borderRadius: 100,
            background: form.inStock ? "#1D9E75" : "#D3D1C7",
            cursor: "pointer", position: "relative",
            transition: "background 0.22s",
          }}
        >
          <motion.div
            animate={{ x: form.inStock ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              position: "absolute", top: 2,
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
            }}
          />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: form.inStock ? "#0F6E56" : "#888780" }}>
          {form.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </motion.div>

      {/* Submit */}
      <motion.div variants={fadeUp}>
        <motion.button
          type="submit"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#9FE1CB" : "#1D9E75",
            color: "#fff", border: "none",
            borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              style={{
                width: 18, height: 18,
                border: "2.5px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff", borderRadius: "50%",
              }}
            />
          ) : (
            <><FiPlusCircle size={16} /> Add Product to Store</>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

/* ══════════════════════════════════════════════════════════
   TAB 2 — PRODUCT LIST
══════════════════════════════════════════════════════════ */
const ProductList = ({ products, onUpdate, onDelete, showToast }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditData({ price: p.price, offerPrice: p.offerPrice, inStock: p.inStock });
  };

  const saveEdit = (id) => {
    if (+editData.offerPrice > +editData.price) {
      showToast("Offer price can't exceed original price", "error");
      return;
    }
    onUpdate(id, {
      price:      +editData.price,
      offerPrice: +editData.offerPrice,
      inStock:    editData.inStock,
    });
    setEditingId(null);
  };

  if (products.length === 0) return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      style={{
        textAlign: "center", padding: "4rem 2rem",
        background: "#fff", borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <p style={{ fontSize: 44, marginBottom: 12 }}>📦</p>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2C2C2A", margin: "0 0 6px" }}>No products yet</h3>
      <p style={{ fontSize: 14, color: "#888780" }}>Add your first product using the "Add Product" tab.</p>
    </motion.div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {products.map(p => {
        const isEditing = editingId === p._id;
        const discount  = Math.round(((p.price - p.offerPrice) / p.price) * 100);

        return (
          <motion.div key={p._id} variants={fadeUp} layout
            style={{
              background: "#fff", borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
              <img
                src={Array.isArray(p.image) ? p.image[0] : p.image}
                alt={p.name}
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 12, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2A" }}>{p.name}</span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 100, fontWeight: 600,
                    background: "#E1F5EE", color: "#0F6E56",
                  }}>
                    {p.category}
                  </span>
                  {discount > 0 && (
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 100, fontWeight: 600,
                      background: "#FAEEDA", color: "#854F0B",
                    }}>
                      {discount}% off
                    </span>
                  )}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888780" }}>
                  {p.unit}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {isEditing ? (
                  <>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => saveEdit(p._id)}
                      style={{
                        padding: "7px 14px", borderRadius: 10,
                        background: "#1D9E75", color: "#fff",
                        border: "none", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <FiCheck size={13} /> Save
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: "7px 10px", borderRadius: 10,
                        background: "#F1EFE8", color: "#5F5E5A",
                        border: "none", cursor: "pointer",
                      }}
                    >
                      <FiX size={14} />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => startEdit(p)}
                      style={{
                        padding: "7px 10px", borderRadius: 10,
                        background: "#E6F1FB", color: "#185FA5",
                        border: "none", cursor: "pointer",
                      }}
                    >
                      <FiEdit2 size={14} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(p._id)}
                      style={{
                        padding: "7px 10px", borderRadius: 10,
                        background: "#FCEBEB", color: "#A32D2D",
                        border: "none", cursor: "pointer",
                      }}
                    >
                      <FiTrash2 size={14} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Inline Edit Panel */}
            <AnimatePresence initial={false}>
              {isEditing && (
                <motion.div
                  key="edit"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    padding: "14px 16px",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    background: "#F8FAF9",
                    display: "grid", gridTemplateColumns: "1fr 1fr auto",
                    gap: 14, alignItems: "end",
                  }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 5 }}>
                        ORIGINAL PRICE (₹)
                      </label>
                      <input
                        type="number" value={editData.price}
                        onChange={e => setEditData(p => ({ ...p, price: e.target.value }))}
                        style={{
                          width: "100%", padding: "9px 12px",
                          border: "1.5px solid rgba(0,0,0,0.12)",
                          borderRadius: 10, fontSize: 14,
                          fontFamily: "inherit", outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 5 }}>
                        OFFER PRICE (₹)
                      </label>
                      <input
                        type="number" value={editData.offerPrice}
                        onChange={e => setEditData(p => ({ ...p, offerPrice: e.target.value }))}
                        style={{
                          width: "100%", padding: "9px 12px",
                          border: "1.5px solid rgba(0,0,0,0.12)",
                          borderRadius: 10, fontSize: 14,
                          fontFamily: "inherit", outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#888780", display: "block", marginBottom: 5 }}>
                        STOCK
                      </label>
                      <div
                        onClick={() => setEditData(p => ({ ...p, inStock: !p.inStock }))}
                        style={{
                          width: 44, height: 28, borderRadius: 100,
                          background: editData.inStock ? "#1D9E75" : "#D3D1C7",
                          cursor: "pointer", position: "relative",
                          transition: "background 0.22s",
                        }}
                      >
                        <motion.div
                          animate={{ x: editData.inStock ? 18 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          style={{
                            position: "absolute", top: 4,
                            width: 20, height: 20, borderRadius: "50%", background: "#fff",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Strip */}
            {!isEditing && (
              <div style={{
                padding: "6px 16px",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                background: p.inStock ? "#F8FAF9" : "#FFF5F5",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: p.inStock ? "#0F6E56" : "#A32D2D" }}>
                  {p.inStock ? "● In stock" : "● Out of stock"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#888780", textDecoration: "line-through" }}>₹{p.price}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1D9E75" }}>₹{p.offerPrice}</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   TAB 3 — ORDERS LIST
══════════════════════════════════════════════════════════ */
const OrdersList = ({ orders, onStatusChange, showToast }) => {
  if (orders.length === 0) return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show"
      style={{
        textAlign: "center", padding: "4rem 2rem",
        background: "#fff", borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <p style={{ fontSize: 44, marginBottom: 12 }}>📭</p>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2C2C2A", margin: "0 0 6px" }}>No orders yet</h3>
      <p style={{ fontSize: 14, color: "#888780" }}>Orders placed by customers will appear here.</p>
    </motion.div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {orders.map(order => {
        const cfg   = STATUS[order.status] || STATUS.processing;
        const total = order.amount != null ? Number(order.amount) : order.items.reduce((s, i) => s + (Number(i.price ?? i.product?.offerPrice ?? 0)) * (Number(i.qty ?? i.quantity ?? 1)), 0);

        return (
          <motion.div key={order._id || order.id} variants={fadeUp}
            style={{
              background: "#fff", borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px", flexWrap: "wrap", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: cfg.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {cfg.icon}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2A" }}>
                      {order._id || order.id}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 9px",
                      borderRadius: 100, background: cfg.bg, color: cfg.color,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888780" }}>
                    {order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{isNaN(total) ? 0 : total.toFixed(0)}
                  </p>
                </div>
              </div>

              <select
                value={order.status}
                onChange={e => {
                  onStatusChange(order._id || order.id, e.target.value);
                  showToast("Order status updated!");
                }}
                style={{
                  padding: "7px 12px", borderRadius: 10,
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  fontSize: 12, fontWeight: 600,
                  fontFamily: "inherit", cursor: "pointer",
                  color: "#2C2C2A", background: "#fff", outline: "none",
                }}
              >
                {Object.entries(STATUS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            {/* Items */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              {order.items.map((item, i) => {
                const itemName = item.name || item.product?.name || "Product";
                const itemQty  = item.qty ?? item.quantity ?? 1;
                const itemPrice = Number(item.price ?? item.product?.offerPrice ?? item.product?.price ?? 0);
                const itemImg = item.image || (Array.isArray(item.product?.image) ? item.product.image[0] : item.product?.image);

                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "8px 16px",
                    borderBottom: i < order.items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                    background: "#FAFAF9",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {itemImg && (
                        <img src={itemImg} alt={itemName} style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 6 }} />
                      )}
                      <span style={{ fontSize: 13, color: "#5F5E5A" }}>
                        {itemName} <span style={{ color: "#B4B2A9" }}>×{itemQty}</span>
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>
                      ₹{(itemPrice * itemQty).toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Address */}
            <div style={{ padding: "8px 16px", background: "#F8FAF9" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#888780" }}>
                📍 {typeof order.address === "object" 
  ? `${order.address?.firstName || ""} ${order.address?.lastName || ""}, ${order.address?.city || ""}`
  : order.address
} · 💳 {order.paymentMethod}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN — SELLER DASHBOARD
══════════════════════════════════════════════════════════ */
const TABS = [
  { id: "add",      label: "Add Product", icon: FiPlusCircle },
  { id: "products", label: "My Products", icon: FiList },
  { id: "orders",   label: "Orders",      icon: FiShoppingBag },
];

const SellerDashboard = () => {
  const {
    setIsSeller, navigate,
    orders: ctxOrders = [], setOrders,
    axios, fetchProducts,
  } = useAppContext();

  const [tab,        setTab]        = useState("add");
  const [products,   setProducts]   = useState([]);
  const [orders,     setLocalOrders] = useState([]);
  const [toastState, setToastState] = useState(null);
  const [loading,    setLoading]    = useState(true);

  const showToast = (msg, type = "success") => {
    setToastState({ msg, type });
    setTimeout(() => setToastState(null), 2800);
  };

  // ✅ Fetch products from backend on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get('/api/product/list');
        if (data.success) {
          const normalized = data.products.map(p => ({
            ...p,
            image:   Array.isArray(p.image) ? p.image : [p.image],
            addedAt: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-IN")
              : "—",
          }));
          setProducts(normalized);
        }
      } catch (err) {
        showToast("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // SellerDashboard mein useEffect add karo:


useEffect(() => {
  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/all");
      if (data.success) {
        const normalized = data.orders.map(o => ({
          id:            o._id,
          amount:        o.amount,
          date:          new Date(o.createdAt).toLocaleDateString("en-IN"),
          status:        o.status || "processing",
          address:       typeof o.address === "object"
                           ? `${o.address?.firstName || ""} ${o.address?.lastName || ""}, ${o.address?.city || ""}`.trim()
                           : o.address,
          paymentMethod: o.paymentType || "COD",
          items:         (o.items || []).map(i => ({
            name:  i.product?.name  || "Product",
            price: i.product?.offerPrice ?? i.product?.price ?? 0,
            qty:   i.quantity ?? i.qty ?? 1,
            image: i.product?.image ? (Array.isArray(i.product.image) ? i.product.image[0] : i.product.image) : null,
          })),
        }));
        setLocalOrders(normalized);
      }
    } catch (error) {
      console.error("Orders fetch failed:", error.message);
    }
  };

  fetchAllOrders();
}, []);

  /* ── Product Handlers ── */

  // onAdd: AddProduct component calls this after successful API call
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    fetchProducts(); // ✅ AppContext ka global products bhi refresh karo
  };

  // ✅ Update — backend se connected
  const handleUpdateProduct = async (id, changes) => {
    try {
      const { data } = await axios.put('/api/product/update', { id, ...changes });
      if (data.success) {
        setProducts(prev =>
          prev.map(p => p._id === id ? { ...p, ...changes } : p)
        );
        showToast("Product updated!");
      } else {
        showToast(data.message || "Update failed", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  // ✅ Delete — backend se connected
  const handleDeleteProduct = async (id) => {
    try {
      const { data } = await axios.delete('/api/product/delete', { data: { id } });
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        showToast("Product removed", "error");
        fetchProducts(); // ✅ global refresh
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  /* ── Order Status Handler ── */
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const { data } = await axios.post("/api/order/status", {
      orderId,
      status: newStatus,
    });

    if (data.success) {
      
      const updated = orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      setLocalOrders(updated);
      showToast("Order status updated!");
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("Status update failed", "error");
  }
};

  /* ── Logout ── */
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        setIsSeller(false);
        navigate("/");
      } else {
        showToast(data.message || "Logout failed", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Logout failed", "error");
    }
  };

  /* ── Stats ── */
  const totalRevenue = orders.reduce((s, o) => {
    const orderSum = o.amount != null && !isNaN(Number(o.amount))
      ? Number(o.amount)
      : (o.items || []).reduce((a, i) => a + (Number(i.price ?? i.product?.offerPrice ?? 0)) * (Number(i.qty ?? i.quantity ?? 1)), 0);
    return s + (isNaN(orderSum) ? 0 : orderSum);
  }, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(150deg, #F1EFE8 0%, #E1F5EE 100%)",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      {/* ── Top Nav ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 2rem",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 60,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#1D9E75",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🌿</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#2C2C2A", letterSpacing: "-0.02em" }}>
            GreenCart <span style={{ color: "#1D9E75" }}>Seller</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>👤</div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "#FCEBEB", color: "#A32D2D",
              border: "none", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <FiLogOut size={13} /> Logout
          </motion.button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* ── Stat Cards ── */}
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: "1.75rem" }}
        >
          <StatCard icon={FiPackage}    label="Total Products" value={loading ? "…" : products.length} accent="#1D9E75" />
          <StatCard icon={FiShoppingBag} label="Total Orders"  value={orders.length}                    accent="#185FA5" />
          <StatCard icon={FiTrendingUp}  label="Revenue"       value={`₹${totalRevenue.toLocaleString("en-IN")}`} accent="#854F0B" />
        </motion.div>

        {/* ── Tab Bar ── */}
        <div style={{
          display: "flex", gap: 6,
          background: "#fff", padding: 5,
          borderRadius: 14, marginBottom: "1.5rem",
          border: "1px solid rgba(0,0,0,0.07)",
        }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id} onClick={() => setTab(id)}
              animate={{
                background: tab === id ? "#1D9E75" : "transparent",
                color:      tab === id ? "#fff"    : "#888780",
              }}
              transition={{ duration: 0.2 }}
              style={{
                flex: 1, padding: "10px 8px",
                borderRadius: 10, border: "none",
                fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 7,
              }}
            >
              <Icon size={15} /> {label}
              {id === "products" && products.length > 0 && (
                <span style={{
                  background: tab === id ? "rgba(255,255,255,0.25)" : "#E1F5EE",
                  color:      tab === id ? "#fff" : "#0F6E56",
                  fontSize: 11, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 100,
                }}>
                  {products.length}
                </span>
              )}
              {id === "orders" && orders.length > 0 && (
                <span style={{
                  background: tab === id ? "rgba(255,255,255,0.25)" : "#FAEEDA",
                  color:      tab === id ? "#fff" : "#854F0B",
                  fontSize: 11, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 100,
                }}>
                  {orders.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "add" && (
              <div style={{
                background: "#fff", borderRadius: 20,
                padding: "1.75rem",
                border: "1px solid rgba(0,0,0,0.07)",
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#2C2C2A", margin: "0 0 1.5rem" }}>
                  Add New Product
                </h2>
                <AddProduct
                  onAdd={handleAddProduct}
                  showToast={showToast}
                  axios={axios}
                />
              </div>
            )}

            {tab === "products" && (
              <ProductList
                products={products}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
                showToast={showToast}
              />
            )}

            {tab === "orders" && (
              <OrdersList
                orders={orders}
                onStatusChange={handleStatusChange}
                showToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastState && <Toast msg={toastState.msg} type={toastState.type} />}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
