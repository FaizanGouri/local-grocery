import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// --------------- animation variants ---------------
const pageVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const slideUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft = {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// --------------- field config ---------------
const FIELDS = [
    { name: "firstName", label: "First name", required: true, span: 1 },
    { name: "lastName", label: "Last name", required: false, span: 1 },
    { name: "email", label: "Email address", required: true, span: 2, type: "email" },
    { name: "street", label: "Street address", required: true, span: 2 },
    { name: "city", label: "City", required: true, span: 1 },
    { name: "state", label: "State / province", required: false, span: 1 },
    { name: "zip", label: "Zip / postal code", required: true, span: 1 },
    { name: "country", label: "Country", required: true, span: 1 },
    { name: "phone", label: "Phone number", required: false, span: 2, type: "tel" },
];

const initialForm = Object.fromEntries(FIELDS.map((f) => [f.name, ""]));

// --------------- toast ---------------
const Toast = ({ message, onDone }) => (
    <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={onDone}
        style={{
            position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            background: "#0F6E56", color: "#fff",
            padding: "0.75rem 1.5rem", borderRadius: "100px",
            fontSize: "14px", fontWeight: 500,
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 8px 24px rgba(15,110,86,0.35)",
            zIndex: 999, whiteSpace: "nowrap",
        }}
    >
        <span style={{ fontSize: "16px" }}>✓</span> Address saved successfully
    </motion.div>
);

// --------------- floating label input ---------------
const Field = ({ field, value, error, onChange, index }) => {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value.length > 0;

    return (
        <motion.div
            variants={slideUp}
            style={{
                gridColumn: field.span === 2 ? "1 / -1" : "span 1",
                position: "relative",
            }}
        >
            <motion.div
                animate={{
                    borderColor: error
                        ? "#E24B4A"
                        : focused
                            ? "#1D9E75"
                            : "rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.2 }}
                style={{
                    position: "relative",
                    borderRadius: "12px",
                    border: "1.5px solid rgba(0,0,0,0.15)",
                    background: "#fff",
                    overflow: "hidden",
                }}
            >
                {/* Animated focus bar */}
                <motion.div
                    animate={{ scaleX: focused ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "2px", background: "#1D9E75",
                        transformOrigin: "left", borderRadius: "0 0 2px 2px",
                    }}
                />

                {/* Floating label */}
                <motion.label
                    animate={{
                        top: lifted ? "8px" : "50%",
                        fontSize: lifted ? "11px" : "14px",
                        color: error ? "#A32D2D" : lifted && focused ? "#0F6E56" : "#888780",
                        y: lifted ? 0 : "-50%",
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                        position: "absolute", left: "14px",
                        pointerEvents: "none", fontWeight: 500,
                        letterSpacing: "0.01em",
                    }}
                >
                    {field.label}{field.required && " *"}
                </motion.label>

                <input
                    name={field.name}
                    type={field.type || "text"}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: "100%",
                        padding: "24px 14px 8px",
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        background: "transparent",
                        color: "#2C2C2A",
                        boxSizing: "border-box",
                    }}
                    autoComplete="on"
                />
            </motion.div>

            {/* Inline error */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            margin: "4px 0 0 4px",
                            fontSize: "12px",
                            color: "#A32D2D",
                            fontWeight: 500,
                        }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --------------- main component ---------------
const AddAddress = () => {
    // const { setAddress } = useAppContext();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(false);
    const [saved, setSaved] = useState(false);
    const { setAddress, axios,  fetchAddress } = useAppContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        FIELDS.forEach((f) => {
            if (f.required && !form[f.name].trim()) {
                newErrors[f.name] = `${f.label} is required`;
            }
        });
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }
        return newErrors;
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    
    const { data } = await axios.post("/api/address/add", form);
    
    if (data.success) {
    setAddress(data.address);    
      setSaved(true);
      setToast(true);
      setTimeout(() => navigate("/cart"), 1200);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

    const handleReset = () => {
        setForm(initialForm);
        setErrors({});
        setSaved(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #F1EFE8 0%, #E1F5EE 100%)",
                paddingTop: "6rem",
                paddingBottom: "4rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2.5rem",
                    alignItems: "start",
                }}
            >
                {/* ── LEFT: Form ── */}
                <motion.form
                    onSubmit={handleSubmit}
                    variants={pageVariants}
                    initial="hidden"
                    animate="show"
                    style={{
                        background: "#fff",
                        borderRadius: "24px",
                        padding: "2.5rem",
                        border: "1px solid rgba(0,0,0,0.07)",
                    }}
                >
                    {/* Header */}
                    <motion.div variants={slideRight} style={{ marginBottom: "2rem" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#1D9E75", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
                            Delivery details
                        </p>
                        <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#2C2C2A", margin: 0, lineHeight: 1.2 }}>
                            Shipping address
                        </h2>
                    </motion.div>

                    {/* Fields grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "14px",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {FIELDS.map((field, i) => (
                            <Field
                                key={field.name}
                                field={field}
                                value={form[field.name]}
                                error={errors[field.name]}
                                onChange={handleChange}
                                index={i}
                            />
                        ))}
                    </div>

                    {/* Submit */}
                    <motion.div variants={slideUp}>
                        <AnimatePresence mode="wait">
                            {!saved ? (
                                <motion.button
                                    key="save"
                                    type="submit"
                                    whileHover={{ scale: 1.02, background: "#0F6E56" }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.18 }}
                                    style={{
                                        width: "100%",
                                        padding: "1rem",
                                        background: "#1D9E75",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        letterSpacing: "0.02em",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Save address
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ display: "flex", gap: "12px" }}
                                >
                                    <div
                                        style={{
                                            flex: 1, padding: "1rem", background: "#E1F5EE",
                                            color: "#0F6E56", borderRadius: "12px",
                                            fontSize: "14px", fontWeight: 600,
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                        }}
                                    >
                                        <span>✓</span> Address saved
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={handleReset}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            padding: "1rem 1.25rem",
                                            background: "transparent",
                                            border: "1.5px solid rgba(0,0,0,0.15)",
                                            borderRadius: "12px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            color: "#5F5E5A",
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        Add new
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.form>

                {/* ── RIGHT: Illustration panel ── */}
                <motion.div
                    variants={slideLeft}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                        paddingTop: "0.5rem",
                    }}
                >
                    {/* Hero card */}
                    <div
                        style={{
                            background: "#0F6E56",
                            borderRadius: "24px",
                            padding: "2.5rem 2rem",
                            color: "#fff",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative circles */}
                        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
                        <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

                        <div style={{ fontSize: "40px", marginBottom: "1rem" }}>📦</div>
                        <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>
                            Fast & secure delivery
                        </h3>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.7 }}>
                            Your address is encrypted and only used for this order. We deliver to 180+ countries.
                        </p>
                    </div>

                    {/* Trust badges */}
                    {[
                        { icon: "🔒", title: "Encrypted & private", desc: "Your data is never sold or shared" },
                        { icon: "🚚", title: "Same-day dispatch", desc: "Order before 2 PM for same-day shipping" },
                        { icon: "↩️", title: "Easy returns", desc: "30-day hassle-free return policy" },
                    ].map((item) => (
                        <motion.div
                            key={item.title}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "1rem 1.25rem",
                                border: "1px solid rgba(0,0,0,0.07)",
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                            }}
                        >
                            <span style={{ fontSize: "22px", flexShrink: 0 }}>{item.icon}</span>
                            <div>
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2C2C2A" }}>{item.title}</p>
                                <p style={{ margin: 0, fontSize: "13px", color: "#888780" }}>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message="Address saved successfully" onDone={() => { }} />}
            </AnimatePresence>
        </div>
    );
};

export default AddAddress;