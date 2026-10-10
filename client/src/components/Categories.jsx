// src/components/Categories.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  FaAppleAlt,
  FaCarrot,
  FaCheese,
  FaBreadSlice,
  FaWineBottle,
  FaCookieBite,
} from 'react-icons/fa';

const categoryConfigs = [
  { icon: <FaAppleAlt />, name: 'Fruits', path: 'Fruits', gradient: 'from-rose-400 to-pink-500' },
  { icon: <FaCarrot />, name: 'Vegetables', path: 'Vegetables', gradient: 'from-orange-400 to-amber-500' },
  { icon: <FaCheese />, name: 'Dairy', path: 'Dairy', gradient: 'from-yellow-400 to-amber-400' },
  { icon: <FaBreadSlice />, name: 'Bakery', path: 'Bakery', gradient: 'from-amber-600 to-yellow-700' },
  { icon: <FaWineBottle />, name: 'Cold Drinks', path: 'Drinks', gradient: 'from-purple-400 to-indigo-500' },
  { icon: <FaCookieBite />, name: 'Instant Food', path: 'Instant', gradient: 'from-blue-400 to-cyan-500' },
];

const Categories = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [active, setActive] = useState(null);
  const { products = [] } = useAppContext();
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      id="categories"
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-4">
            Browse
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shop by <span className="text-emerald-500">Category</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto leading-relaxed">
            Explore our wide selection of fresh groceries organized just for you.
          </p>
        </motion.div>

        {/* grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoryConfigs.map((cat, i) => {
            const isActive = active === i;
            const cPath = cat.path.toLowerCase();
            const count = products.filter((p) => {
              const pCat = (p.category || "").toLowerCase();
              return (
                pCat === cPath ||
                (cPath === "drinks" && (pCat === "beverages" || pCat === "drink")) ||
                (cPath === "instant" && (pCat === "snacks" || pCat === "snack"))
              );
            }).length;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                onClick={() => {
                  setActive(isActive ? null : i);
                  navigate(`/category/${cat.path.toLowerCase()}`);
                }}
                className={`relative flex flex-col items-center justify-center
                            rounded-2xl p-6 cursor-pointer border transition-all duration-300
                            ${isActive
                    ? 'border-emerald-400 shadow-lg shadow-emerald-100 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:shadow-md'
                  }`}
              >
                {/* icon circle */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.gradient}
                              flex items-center justify-center text-white text-2xl mb-4
                              shadow-md transition-transform duration-300
                              ${isActive ? 'scale-110' : ''}`}
                >
                  {cat.icon}
                </div>

                <h3 className="font-semibold text-gray-800 text-sm text-center">{cat.name}</h3>
                <span className="text-xs text-gray-400 mt-1 font-medium">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>

                {/* active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="cat-dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                                 bg-emerald-500 border-2 border-white shadow"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;