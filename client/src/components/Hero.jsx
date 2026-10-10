import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



const floatingItems = [
  { emoji: "🍅", top: "12%", left: "8%", size: "3rem", delay: 0 },
  { emoji: "🥕", top: "25%", right: "12%", size: "2.5rem", delay: 0.3 },
  { emoji: "🥬", bottom: "20%", left: "5%", size: "2.8rem", delay: 0.6 },
  { emoji: "🍋", top: "8%", right: "25%", size: "2.2rem", delay: 0.9 },
  { emoji: "🫐", bottom: "30%", right: "8%", size: "2rem", delay: 1.2 },
  { emoji: "🥑", bottom: "15%", left: "20%", size: "2.4rem", delay: 0.4 },
];

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-cream pt-24 pb-16 px-[5%]"
      id="hero"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-primary-faint rounded-full -top-40 -right-40 opacity-60 blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bg-primary-lightest rounded-full bottom-0 -left-32 opacity-40 blur-3xl" />
        <div className="absolute w-[300px] h-[300px] bg-[#ffecd2] rounded-full top-1/2 left-1/3 opacity-30 blur-3xl" />
      </div>

      {/* Floating Emojis */}
      {floatingItems.map((item, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none hidden lg:block"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            fontSize: item.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.5,
            scale: 1,
            y: [0, -15, 0, 15, 0],
          }}
          transition={{
            opacity: { delay: 1 + item.delay, duration: 0.5 },
            scale: { delay: 1 + item.delay, duration: 0.5 },
            y: {
              delay: 1 + item.delay,
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            className="inline-flex items-center gap-2 bg-primary-faint text-primary text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="w-2 h-2 bg-primary-lighter rounded-full animate-pulse" />
            Trusted by 50,000+ families
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-dark leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          >
            Freshness You Can
            <span className="text-primary-lighter"> Trust,</span>
            <br />
            Savings You'll
            <span className="text-accent"> Love!</span>
          </motion.h1>

          <motion.p
            className="text-lg text-text-light leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Hand-picked produce from local farms, delivered straight to your
            doorstep within 30 minutes. No middlemen, no markups—just clean,
            honest groceries at prices that make sense.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <motion.button
              onClick={() => {
                const section = document.getElementById("products");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-primary text-white border-none px-8 py-4 rounded-full font-[Poppins] font-bold text-base cursor-pointer shadow-lg shadow-primary/20"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 40px rgba(45,106,79,0.35)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🛒</span> Shop Now
            </motion.button>

            <motion.button
              onClick={() => {
                const section = document.getElementById("categories");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-transparent text-primary border-2 border-primary/20 px-8 py-4 rounded-full font-[Poppins] font-semibold text-base cursor-pointer hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Deals <span>→</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            {[
              { value: "10K+", label: "Products" },
              { value: "30 min", label: "Delivery" },
              { value: "4.9 ★", label: "Rating" },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <div className="w-px h-10 bg-primary/15 rounded-full" />
                )}
                <div className="flex flex-col">
                  <strong className="text-xl font-bold text-dark">
                    {stat.value}
                  </strong>
                  <span className="text-xs text-text-light mt-0.5">
                    {stat.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Right - Grocery Cards */}
        <motion.div
          className="flex-1 relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]"
          initial={{ opacity: 0, scale: 0.8, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }}
        >
          {/* Large Circle */}
          <div className="absolute w-[380px] h-[380px] lg:w-[450px] lg:h-[450px] rounded-full bg-gradient-to-br from-primary-faint to-primary-lightest opacity-60" />

          {/* Floating Product Cards */}
          <motion.div
            className="absolute top-4 left-4 lg:top-8 lg:left-0 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-primary/10 border border-white/50"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl">🍅</span>
            <div>
              <strong className="text-sm text-dark block">Tomatoes</strong>
              <p className="text-primary font-bold text-base m-0">₹40/kg</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-16 right-0 lg:top-12 lg:right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-primary/10 border border-white/50"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <span className="text-4xl">🥕</span>
            <div>
              <strong className="text-sm text-dark block">Carrots</strong>
              <p className="text-primary font-bold text-base m-0">₹35/kg</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-0 lg:bottom-16 lg:left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-primary/10 border border-white/50"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <span className="text-4xl">🫑</span>
            <div>
              <strong className="text-sm text-dark block">Bell Pepper</strong>
              <p className="text-primary font-bold text-base m-0">₹60/kg</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 right-8 lg:bottom-8 lg:right-0 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-primary/10 border border-white/50"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
          >
            <span className="text-4xl">🥬</span>
            <div>
              <strong className="text-sm text-dark block">Spinach</strong>
              <p className="text-primary font-bold text-base m-0">₹25/bunch</p>
            </div>
          </motion.div>

          {/* Center Delivery Badge */}
          <motion.div
            className="relative z-10 bg-white rounded-3xl p-6 shadow-xl shadow-primary/15 border border-primary-lightest/50 text-center"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-5xl block mb-2">🚚</span>
            <strong className="text-dark text-lg block">Free Delivery</strong>
            <p className="text-text-light text-sm m-0">Orders above ₹299</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;