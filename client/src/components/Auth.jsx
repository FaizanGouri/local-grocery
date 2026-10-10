import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setShowUserLogin, setUser, axios } = useAppContext();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!isLogin && password !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      if (isLogin) {
        // LOGIN
        const { data } = await axios.post("/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          setUser(data.user);
          setShowUserLogin(false);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      } else {
        // REGISTER
        const { data } = await axios.post("/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setUser(data.user);
          setShowUserLogin(false);
          toast.success("Account created");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-center text-dark mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {isLogin
            ? "Login to continue shopping"
            : "Join us and start shopping fresh"}
        </p>

        <AnimatePresence mode="wait">
          <motion.form
            onSubmit={onSubmitHandler}
            onClick={(e) => e.stopPropagation()}
            key={isLogin}
            initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {!isLogin && (
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-primary">
                <FiUser />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-none w-full"
                />
              </div>
            )}

            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-primary">
              <FiMail />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-primary">
              <FiLock />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none w-full"
              />
            </div>

            {!isLogin && (
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-primary">
                <FiLock />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-none w-full"
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-primary text-white py-3 rounded-xl font-semibold mt-2 shadow-lg"
            >
              {isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold cursor-pointer ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;