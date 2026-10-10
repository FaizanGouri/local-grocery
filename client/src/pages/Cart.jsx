import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

/* ─── Variants ────────────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft = {
  hidden: { opacity: 0, x: 36 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.5,  ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Cart Item Card ──────────────────────────────────────── */
const CartItem = ({ item, qty, onAdd, onRemove, onDelete }) => (
  <motion.div
    variants={fadeUp}
    layout
    exit={{ opacity: 0, x: -24, transition: { duration: 0.28 } }}
    className="bg-white rounded-2xl overflow-hidden"
    style={{ border: "1px solid rgba(0,0,0,0.07)" }}
  >
    <div className="flex items-center gap-4 p-4">

      {/* Product image */}
      <div
        className="rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: 72, height: 72, background: "#F1EFE8" }}
      >
        <img
          src={item.image[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.category || "Grocery"}</p>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mt-2.5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onRemove}
            className="flex items-center justify-center rounded-lg font-bold text-gray-600"
            style={{
              width: 28, height: 28,
              background: "#F1EFE8",
              border: "none", cursor: "pointer", fontSize: 16,
            }}
          >
            −
          </motion.button>
          <span className="text-sm font-bold w-5 text-center text-gray-800">{qty}</span>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onAdd}
            className="flex items-center justify-center rounded-lg font-bold text-white"
            style={{
              width: 28, height: 28,
              background: "#1D9E75",
              border: "none", cursor: "pointer", fontSize: 16,
            }}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Price + delete */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-extrabold text-base" style={{ color: "#1D9E75" }}>
          ₹{item.offerPrice * qty}
        </p>
        <p className="text-xs text-gray-400 line-through">₹{item.price * qty}</p>
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          style={{
            color: "#E24B4A", background: "#FCEBEB",
            border: "none", cursor: "pointer",
            borderRadius: 8, padding: "5px 7px",
          }}
        >
          <FaTrash size={12} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

/* ─── Empty Cart ──────────────────────────────────────────── */
const EmptyCart = ({ onContinue }) => (
  <motion.div
    variants={fadeUp} initial="hidden" animate="show"
    className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl"
    style={{ border: "1px solid rgba(0,0,0,0.07)" }}
  >
    <p style={{ fontSize: 52 }}>🛒</p>
    <h3 className="text-lg font-bold text-gray-800 mt-4 mb-1">Your cart is empty</h3>
    <p className="text-sm text-gray-400 mb-6">Add some fresh items to get started!</p>
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onContinue}
      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
      style={{ background: "#1D9E75", border: "none", cursor: "pointer", fontFamily: "inherit" }}
    >
      Browse products
    </motion.button>
  </motion.div>
);

/* ─── Main Cart Component ─────────────────────────────────── */
const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteFromCart, address, placeOrder, products, fetchAddress, axios } = useAppContext();
  const navigate  = useNavigate();
  const [payment, setPayment] = useState("Cash On Delivery");

  const cartProducts = products.filter((p) => cartItems[p._id]);
  const subtotal     = cartProducts.reduce((acc, p) => acc + p.offerPrice * cartItems[p._id], 0);
  const savings      = cartProducts.reduce((acc, p) => acc + (p.price - p.offerPrice) * cartItems[p._id], 0);
  const tax          = subtotal * 0.02;
  const total        = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!address) {
      navigate("/add-address");
      return;
    }
    if (cartProducts.length === 0) return;
    await placeOrder();
  };


  const handleDeleteAddress = async () => {
  try {
    const { data } = await axios.delete(`/api/address/delete/${address._id}`);
    if (data.success) {
      setAddress(null);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div
      className="min-h-screen px-4 pb-16"
      style={{
        paddingTop: "5.5rem",
        background: "linear-gradient(150deg, #F1EFE8 0%, #E1F5EE 100%)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#1D9E75" }}>
            Your basket
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-800">Shopping Cart</h1>
            <span
              className="text-sm font-medium px-4 py-1 rounded-full bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.08)", color: "#888780" }}
            >
              {cartProducts.length} item{cartProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Cart Items ── */}
          <div className="md:col-span-2">
            {cartProducts.length === 0 ? (
              <EmptyCart onContinue={() => navigate("/")} />
            ) : (
              <>
                <AnimatePresence>
                  <motion.div
                    variants={stagger} initial="hidden" animate="show"
                    className="flex flex-col gap-3"
                  >
                    {cartProducts.map((item) => (
                      <AnimatePresence key={item._id}>
                        <CartItem
                          item={item}
                          qty={cartItems[item._id]}
                          onAdd={() => addToCart(item._id)}
                          onRemove={() => removeFromCart(item._id)}
                          onDelete={() => deleteFromCart(item._id)}
                        />
                      </AnimatePresence>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Savings banner */}
                {savings > 0 && (
                  <motion.div
                    variants={fadeUp} initial="hidden" animate="show"
                    className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl"
                    style={{ background: "#EAF3DE", border: "1px solid #C0DD97" }}
                  >
                    <span style={{ fontSize: 16 }}>🎉</span>
                    <p className="text-sm font-semibold" style={{ color: "#3B6D11" }}>
                      You're saving ₹{savings.toFixed(0)} on this order!
                    </p>
                  </motion.div>
                )}

                {/* Continue shopping */}
                <motion.button
                  whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/")}
                  className="text-sm font-semibold mt-5"
                  style={{ color: "#1D9E75", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  ← Continue shopping
                </motion.button>
              </>
            )}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <motion.div
            variants={slideLeft} initial="hidden" animate="show"
            className="bg-white rounded-2xl p-5 flex flex-col gap-4"
            style={{ border: "1px solid rgba(0,0,0,0.07)", position: "sticky", top: "6rem" }}
          >
            <h3 className="text-lg font-extrabold text-gray-800">Order Summary</h3>

            {/* Delivery Address */}
            <div className="rounded-xl p-3" style={{ background: "#F8FAF9", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Deliver to</p>
                <button
                  onClick={() => navigate("/add-address")}
                  className="text-xs font-semibold"
                  style={{ color: "#1D9E75", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  {address ? "Change" : "Add"}
                </button>
                {address && (
  <button onClick={handleDeleteAddress}
    style={{ color: "#A32D2D", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}
  >
    Remove
  </button>
)}
              </div>

              {address ? (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-800">{address.firstName} {address.lastName}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} — {address.zip}</p>
                  <p>{address.country}</p>
                  {address.phone && <p className="text-gray-400 text-xs mt-1">📞 {address.phone}</p>}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/add-address")}
                  className="w-full py-2 mt-1 rounded-lg text-sm font-semibold"
                  style={{
                    background: "#E1F5EE", color: "#0F6E56",
                    border: "1.5px dashed #9FE1CB", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  + Add delivery address
                </button>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Payment</p>
              <div className="flex flex-col gap-2">
                {["Cash On Delivery", "UPI"].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                    style={{
                      border: `1.5px solid ${payment === method ? "#1D9E75" : "rgba(0,0,0,0.08)"}`,
                      background: payment === method ? "#E1F5EE" : "#fff",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={payment === method}
                      onChange={() => setPayment(method)}
                      style={{ accentColor: "#1D9E75" }}
                    />
                    <span className="text-sm font-semibold" style={{ color: payment === method ? "#0F6E56" : "#5F5E5A" }}>
                      {method === "Cash On Delivery" ? "💵 Cash on delivery" : "📱 UPI"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="flex flex-col gap-2 text-sm" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1rem" }}>
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between" style={{ color: "#3B6D11" }}>
                  <span>Savings</span>
                  <span>−₹{savings.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span style={{ color: "#1D9E75", fontWeight: 600 }}>Free</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (2%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div
                className="flex justify-between font-extrabold text-base pt-2"
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "#2C2C2A" }}
              >
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order */}
            <motion.button
              whileHover={{ scale: cartProducts.length > 0 ? 1.02 : 1, background: "#0F6E56" }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={cartProducts.length === 0}
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{
                background: cartProducts.length === 0 ? "#9FE1CB" : "#1D9E75",
                border: "none", cursor: cartProducts.length === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.2s",
              }}
            >
              {!address
                ? "Add address to continue →"
                : cartProducts.length === 0
                ? "Cart is empty"
                : `Place order · ₹${total.toFixed(2)}`}
            </motion.button>

            {/* Trust line */}
            <p className="text-center text-xs text-gray-400">
              🔒 Secure checkout · Free returns
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Cart;