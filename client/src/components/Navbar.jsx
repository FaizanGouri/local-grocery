import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";

const Navbar = () => {
 
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  
 const { 
  user, setUser,
  setShowUserLogin,
  navigate,
  setSearchQuery,
  searchQuery,
  cartItems,
  axios, 
} = useAppContext();

  const location = useLocation();

const logout = async () => {
  try {
    const { data } = await axios.post("/api/user/logout"); 
    if (data.success) {
      setUser(null);
      toast.success(data.message || "Logged out successfully");
      navigate("/");
    } else {
      toast.error(data.message || "Logout failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery.length > 0) {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Categories", id: "categories" },
    { label: "Products", id: "products" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Reviews", id: "testimonials" },
    
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id, path) => {
    setMobileOpen(false); // ✅ FIX 6: Close mobile menu on any nav click
    if (path) {
      navigate(path);
      return;
    }
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ FIX 7: Compute real cart count from context
  const cartCount = cartItems
    ? Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
    : 0;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-xl transition-all duration-400 ${
        scrolled
          ? "bg-white/95 shadow-md border-b border-primary/5"
          : "bg-white/70 border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-8">
        {/* ✅ FIX 8: Logo uses onClick + button instead of empty href */}
        <button
          onClick={() => handleNavClick("hero")}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer shrink-0"
        >
          <span className="text-3xl">🌿</span>
          <span className="text-2xl font-extrabold text-dark">
            Green<span className="text-primary-lighter">Cart</span>
          </span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden lg:flex list-none gap-1">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              {/* ✅ FIX 9: Replaced nested <li> with <button> — nested li is invalid HTML */}
              <button
                onClick={() => handleNavClick(link.id, link.path)}
                className="bg-transparent border-none no-underline text-text-main font-medium text-sm px-4 py-2 rounded-lg hover:text-primary hover:bg-green-tint transition-all duration-300 cursor-pointer font-[Poppins]"
              >
                {link.label}
              </button>
            </motion.li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="hidden md:flex items-center bg-green-tint rounded-full px-4 py-2.5 gap-2 border-2 border-transparent focus-within:border-primary-lighter focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(82,183,136,0.1)] transition-all duration-300">
            <FiSearch className="text-text-light text-base shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search groceries..."
              className="border-none outline-none bg-transparent font-[Poppins] text-sm text-text-main w-40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-xs bg-transparent border-none cursor-pointer p-0"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Cart */}
          <motion.button
            onClick={() => navigate("/cart")}
            className="relative bg-green-tint border-none w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer text-lg text-text-main hover:bg-primary-lightest hover:text-primary transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShoppingCart />
            
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[0.6rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Login / Profile */}
          {!user ? (
            <motion.button
              onClick={() => setShowUserLogin(true)}
              className="hidden sm:flex items-center gap-2 bg-primary text-white border-none px-5 py-2.5 rounded-full font-[Poppins] font-semibold text-sm cursor-pointer transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 20px rgba(45,106,79,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUser />
              <span>Login</span>
            </motion.button>
          ) : (
            <div className="relative group">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300"
                alt="user"
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <ul className="flex flex-col py-2 text-sm text-gray-700">
                  <li
                    onClick={() => navigate("/my-orders")}
                    className="px-4 py-2 hover:bg-green-50 hover:text-primary cursor-pointer transition"
                  >
                    My Orders
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-red-50 hover:text-red-500 cursor-pointer transition"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="lg:hidden bg-transparent border-none text-2xl text-text-main cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden flex flex-col px-6 pb-5 gap-1 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ✅ FIX 12: Mobile links now use handleNavClick + button instead of broken <a href={link.href}> */}
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id, link.path)}
                className="text-left bg-transparent border-none no-underline text-text-main font-medium py-3 px-4 rounded-lg hover:bg-green-tint transition-colors cursor-pointer font-[Poppins]"
              >
                {link.label}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => {
                  setMobileOpen(false); // ✅ FIX 13: Was referencing dead `SetOpen`
                  setShowUserLogin(true);
                }}
                className="mt-2 bg-primary text-white border-none py-3 rounded-lg font-[Poppins] font-semibold cursor-pointer"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="mt-2 bg-primary text-white border-none py-3 rounded-lg font-[Poppins] font-semibold cursor-pointer"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
export default Navbar;