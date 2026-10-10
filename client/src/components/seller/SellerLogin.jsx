import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

/* ─── Variants ────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

const slideForm = (dir) => ({
  initial: { opacity: 0, x: dir === "left" ? -32 : 32 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: dir === "left" ? 32 : -32, transition: { duration: 0.25 } },
});

/* ─── Floating Label Input ────────────────────────────────── */
const Field = ({ icon: Icon, label, type = "text", value, onChange, delay = 0 }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      style={{ position: "relative" }}
    >
      <motion.div
        animate={{
          borderColor: focused ? "#1D9E75" : "rgba(255,255,255,0.12)",
          background:  focused ? "rgba(29,158,117,0.06)" : "rgba(255,255,255,0.04)",
        }}
        transition={{ duration: 0.2 }}
        style={{
          borderRadius: 14,
          border: "1.5px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center",
          gap: 10, padding: "0 14px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Focus glow bar */}
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 2, background: "#1D9E75",
            transformOrigin: "left", borderRadius: "0 0 2px 2px",
          }}
        />

        {/* Icon */}
        <Icon
          size={15}
          style={{
            color: focused ? "#1D9E75" : "rgba(255,255,255,0.35)",
            flexShrink: 0, transition: "color 0.2s",
          }}
        />

        {/* Floating label */}
        <div style={{ flex: 1, position: "relative", height: 52 }}>
          <motion.label
            animate={{
              top:      lifted ? 8   : "50%",
              fontSize: lifted ? 10  : 14,
              y:        lifted ? 0   : "-50%",
              color:    lifted && focused
                ? "#1D9E75"
                : lifted
                ? "rgba(255,255,255,0.4)"
                : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute", left: 0,
              pointerEvents: "none", fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </motion.label>

          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: "absolute", bottom: 6, left: 0, right: 0,
              background: "transparent", border: "none", outline: "none",
              fontSize: 14, color: "#fff", fontFamily: "inherit", width: "100%",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Seller Perks (right panel) ─────────────────────────── */
const PERKS = [
  { icon: "📦", text: "List unlimited products" },
  { icon: "📊", text: "Real-time sales dashboard" },
  { icon: "💸", text: "Fast weekly payouts" },
  { icon: "🛡️", text: "Seller protection guarantee" },
];

/* ─── Main Component ──────────────────────────────────────── */
const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();

  // ✅ Fixed: only navigate when isSeller becomes true, not on first render
  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller]);

  // ✅ Fixed: separate mode state — not tied to isSeller
  const [mode,     setMode]     = useState("login"); // "login" | "signup"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const isLogin = mode === "login";

  const validate = () => {
    const e = {};
    if (!isLogin && !name.trim())          e.name     = "Name is required";
    if (!email.trim())                     e.email    = "Email is required";
    if (!password)                         e.password = "Password is required";
    if (!isLogin && password !== confirm)  e.confirm  = "Passwords don't match";
    return e;
  };

 const handleSubmit = async (event) => {
  event.preventDefault(); // 

  const e = validate();
  if (Object.keys(e).length > 0) {
    setErrors(e);
    return;
  }

  setLoading(true);

  try {
    const { data } = await axios.post("/api/seller/login", { email, password });

    if (data.success) {
      setIsSeller(true);
      navigate("/seller");
      toast.success("Login successful");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Login failed");
  }

  setLoading(false);
};

  const switchMode = () => {
    setMode(m => m === "login" ? "signup" : "login");
    setErrors({});
    setName(""); setEmail(""); setPassword(""); setConfirm("");
  };

  if (isSeller) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#0D1F18",
      }}
    >
      {/* ── LEFT: Form Panel ── */}
      <div
        style={{
          flex: "0 0 480px", maxWidth: 480,
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "3rem 3rem",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo / brand */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#1D9E75",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              🌿
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              GreenCart <span style={{ color: "#1D9E75" }}>Sellers</span>
            </span>
          </div>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12, padding: 4,
            marginBottom: "2rem",
          }}
        >
          {["login", "signup"].map((m) => (
            <motion.button
              key={m}
              onClick={() => { setMode(m); setErrors({}); setName(""); setEmail(""); setPassword(""); setConfirm(""); }}
              animate={{
                background: mode === m ? "#1D9E75" : "transparent",
                color:      mode === m ? "#fff"    : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.22 }}
              style={{
                flex: 1, padding: "9px 0",
                borderRadius: 9, border: "none",
                fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </motion.button>
          ))}
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={handleSubmit}
            {...slideForm(isLogin ? "right" : "left")}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <motion.div variants={containerVariants} initial="hidden" animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* Name — signup only */}
              {!isLogin && (
                <Field
                  icon={FiUser} label="Full name"
                  value={name} onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ""})); }}
                />
              )}

              <Field
                icon={FiMail} label="Email address" type="email"
                value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }}
              />

              <Field
                icon={FiLock} label="Password" type="password"
                value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }}
              />

              {/* Confirm password — signup only */}
              {!isLogin && (
                <Field
                  icon={FiLock} label="Confirm password" type="password"
                  value={confirm} onChange={e => { setConfirm(e.target.value); setErrors(p => ({...p, confirm: ""})); }}
                />
              )}
            </motion.div>

            {/* Inline errors */}
            <AnimatePresence>
              {Object.values(errors).filter(Boolean).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: "rgba(226,75,74,0.12)",
                    border: "1px solid rgba(226,75,74,0.25)",
                    borderRadius: 10, padding: "10px 14px",
                  }}
                >
                  {Object.values(errors).filter(Boolean).map((err, i) => (
                    <p key={i} style={{ color: "#F09595", fontSize: 12, margin: "2px 0", fontWeight: 500 }}>
                      · {err}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot password */}
            {isLogin && (
              <div style={{ textAlign: "right", marginTop: -6 }}>
                <button type="button" style={{
                  background: "none", border: "none",
                  color: "#1D9E75", fontSize: 12,
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.02, background: "#0F6E56" }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#0F6E56" : "#1D9E75",
                color: "#fff", border: "none",
                borderRadius: 14, fontSize: 15,
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                transition: "background 0.2s",
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={{
                    width: 18, height: 18,
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <>
                  {isLogin ? "Sign in to dashboard" : "Create seller account"}
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>

            {/* Switch mode */}
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                style={{
                  background: "none", border: "none",
                  color: "#1D9E75", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>
      </div>

      {/* ── RIGHT: Brand Panel ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          flex: 1,
          background: "linear-gradient(145deg, #0F3D2C 0%, #0D2A1E 60%, #081A12 100%)",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "flex-start",
          padding: "4rem",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: 340, height: 340, borderRadius: "50%",
          background: "rgba(29,158,117,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "10%",
          width: 220, height: 220, borderRadius: "50%",
          background: "rgba(29,158,117,0.05)",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "15%",
          width: 100, height: 100, borderRadius: "50%",
          background: "rgba(29,158,117,0.06)",
        }} />

        {/* Content */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="show"
          style={{ position: "relative", zIndex: 1, maxWidth: 400 }}
        >
          <motion.div variants={fadeUp}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: "#1D9E75", letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Seller portal
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: 38, fontWeight: 900,
              color: "#fff", lineHeight: 1.15,
              margin: "12px 0 16px",
              letterSpacing: "-0.03em",
            }}
          >
            Grow your<br />
            <span style={{ color: "#1D9E75" }}>grocery business</span><br />
            with us.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 14, color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7, marginBottom: "2rem",
            }}
          >
            Join thousands of sellers delivering fresh products
            directly to customers across India.
          </motion.p>

          {/* Perks list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.text}
                variants={fadeUp}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: "rgba(29,158,117,0.12)",
                  border: "1px solid rgba(29,158,117,0.2)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, flexShrink: 0,
                }}>
                  {perk.icon}
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                  {perk.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex", gap: 24, marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[
              { value: "12K+", label: "Active sellers" },
              { value: "₹4Cr+", label: "Monthly payouts" },
              { value: "98%",   label: "Satisfaction rate" },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#1D9E75", margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SellerLogin;