import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";

/* ─── Animation Variants ──────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.3 } },
};

/* ─── Status Config ───────────────────────────────────────── */
const STATUS = {
  processing:         { label: "Processing",       bg: "#FAEEDA", color: "#854F0B", step: 1, icon: "⏳" },
  shipped:            { label: "Shipped",           bg: "#E6F1FB", color: "#185FA5", step: 2, icon: "🚚" },
  "out-for-delivery": { label: "Out for delivery",  bg: "#E1F5EE", color: "#0F6E56", step: 3, icon: "📍" },
  delivered:          { label: "Delivered",         bg: "#EAF3DE", color: "#3B6D11", step: 4, icon: "✅" },
  cancelled:          { label: "Cancelled",         bg: "#FCEBEB", color: "#A32D2D", step: 0, icon: "✕"  },
};

const STEPS = ["Placed", "Processing", "Shipped", "Out for delivery", "Delivered"];

/* ─── Progress Tracker ────────────────────────────────────── */
const Tracker = ({ status }) => {
  const cfg = STATUS[status] || STATUS.processing;
  if (!cfg || status === "cancelled") return null;

  return (
    <div className="flex items-center mt-4 mb-2">
      {STEPS.map((label, i) => {
        const done   = i < cfg.step;
        const active = i === cfg.step - 1;
        const last   = i === STEPS.length - 1;
        return (
          <div key={label} className="flex items-center" style={{ flex: last ? "0 0 auto" : 1 }}>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.07, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: done || active ? "#1D9E75" : "#E1F5EE",
                  border: active ? "3px solid #0F6E56" : done ? "none" : "2px solid #9FE1CB",
                  boxShadow: active ? "0 0 0 4px rgba(29,158,117,0.18)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  color: done || active ? "#fff" : "#9FE1CB",
                }}
              >
                {done ? "✓" : i + 1}
              </motion.div>
              <span style={{
                fontSize: 9, fontWeight: active ? 700 : 500,
                whiteSpace: "nowrap", textAlign: "center",
                color: done || active ? "#0F6E56" : "#B4B2A9",
              }}>
                {label}
              </span>
            </div>
            {!last && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: done ? 1 : 0 }}
                transition={{ delay: i * 0.1 + 0.15, duration: 0.35 }}
                style={{
                  flex: 1, height: 3, marginBottom: 16,
                  background: done ? "#1D9E75" : "#E1F5EE",
                  transformOrigin: "left", borderRadius: 2,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Order Card ──────────────────────────────────────────── */
const OrderCard = ({ order, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const cfg   = STATUS[order.status];
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <motion.div
      variants={fadeUp}
      layout
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.07)" }}
    >
      {/* ── Header ── */}
      <div
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 44, height: 44, background: cfg.bg, fontSize: 20 }}
        >
          {cfg.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-800">{order.id}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{total}
          </p>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-gray-400 text-base flex-shrink-0"
        >
          ▾
        </motion.span>
      </div>

      {/* ── Expandable Body ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Tracker status={order.status} />

              {/* Items */}
              <div className="flex flex-col gap-2 mt-3">
                {order.items.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: "#F8FAF9" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 42, height: 42, fontSize: 18,
                        background: "linear-gradient(135deg, #E1F5EE, #9FE1CB)",
                      }}
                    >
                      {item.icon || "🛒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#1D9E75" }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: "Total",   value: `₹${total}` },
                  { label: "Payment", value: order.paymentMethod },
                  { label: "Ship to", value: order.address.split(",")[0] },
                ].map(m => (
                  <div key={m.label} className="rounded-xl p-2.5" style={{ background: "#F1EFE8" }}>
                    <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                    <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {order.status === "delivered" && (
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "#1D9E75", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Reorder
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: "transparent", border: "1.5px solid rgba(0,0,0,0.12)",
                      color: "#5F5E5A", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Review
                  </motion.button>
                </div>
              )}

              {order.status === "out-for-delivery" && (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "#E6F1FB", color: "#185FA5",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  📍 Track live location
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Filter Tabs ─────────────────────────────────────────── */
const FILTERS = ["All", "Active", "Delivered", "Cancelled"];

/* ─── Main Page ───────────────────────────────────────────── */
const MyOrders = () => {
 
  const { orders: ctxOrders = [], navigate, fetchOrders  } = useAppContext();

  const orders = ctxOrders.map(o => ({
  id:            o._id,
  date:          new Date(o.createdAt).toLocaleDateString("en-IN"),
  status:        o.status?.toLowerCase().replace(" ", "-") || "processing",
  address:       typeof o.address === "object"
                   ? `${o.address.firstName}, ${o.address.city}`
                   : o.address,
  paymentMethod: o.paymentType || "COD",
  items:         o.items.map(i => ({
    productId: i.product?._id,
    name:      i.product?.name || "Product",
    price:     i.product?.offerPrice || 0,
    qty:       i.quantity,
    category:  i.product?.category,
  })),
}));

useEffect(() => {
  fetchOrders(); 
  
  
  const interval = setInterval(fetchOrders, 30000);
  return () => clearInterval(interval);
}, []);

  const [filter, setFilter] = useState("All");

  const filtered = orders.filter(o => {
    if (filter === "All")       return true;
    if (filter === "Active")    return ["processing", "shipped", "out-for-delivery"].includes(o.status);
    if (filter === "Delivered") return o.status === "delivered";
    if (filter === "Cancelled") return o.status === "cancelled";
    return true; // ✅ fallback always returns a value
  });

  return (
    <div
      className="min-h-screen px-4 pb-16"
      style={{
        paddingTop: "5.5rem",
        background: "linear-gradient(150deg, #F1EFE8 0%, #E1F5EE 100%)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#1D9E75" }}>
            Your account
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-800">My Orders</h1>
            <span
              className="text-sm font-medium px-4 py-1 rounded-full bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.08)", color: "#888780" }}
            >
              {orders.length} orders
            </span>
          </div>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="show"
          className="flex gap-2 mb-5 flex-wrap"
        >
          {FILTERS.map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                border: `1.5px solid ${filter === f ? "#1D9E75" : "rgba(0,0,0,0.1)"}`,
                background: filter === f ? "#1D9E75" : "#fff",
                color: filter === f ? "#fff" : "#5F5E5A",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Orders / Empty ── */}
        {/* ✅ AnimatePresence with mode="wait" — no flicker on filter switch */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={filter}
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
              className="flex flex-col gap-3"
            >
              {filtered.map((order, i) => (
                <OrderCard key={order.id} order={order} defaultOpen={i === 0} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={fadeUp} initial="hidden" animate="show"
              className="text-center py-20 bg-white rounded-2xl"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                No {filter.toLowerCase()} orders
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Looks like you haven't placed any orders yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#1D9E75", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Start shopping
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MyOrders;