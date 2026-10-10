// src/components/Products.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";


// Correct filters based on dummyProducts
const filters = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Drinks",
  "Grains",
  "Instant",
];


const Products = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    fetchProducts,
    products,
    searchQuery,
    setSearchQuery,
  } = useAppContext();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Filtering logic: both category and search query
  const query = (searchQuery || "").trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesCategory =
      activeFilter === "All" ||
      (p.category && p.category.toLowerCase() === activeFilter.toLowerCase());

    const matchesSearch =
      !query ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (Array.isArray(p.description)
        ? p.description.some((d) => d && d.toLowerCase().includes(query))
        : p.description && p.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  //  Wishlist toggle
  const toggleWish = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section
      ref={ref}
      id="products"
      className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold uppercase mb-4">
            Our Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Fresh & <span className="text-emerald-500">Trending</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                ${activeFilter === f
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border hover:text-emerald-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Results Banner */}
        {query && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl mb-8 max-w-xl mx-auto">
            <span className="text-sm text-emerald-800">
              Search results for <strong className="font-bold">"{searchQuery}"</strong> ({filtered.length} found)
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs bg-white text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer transition"
            >
              Clear ✕
            </button>
          </div>
        )}

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                No products found {query ? `for "${searchQuery}"` : ""}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                Try checking for typos or searching for another grocery item.
              </p>
              {query && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((product) => {
                const loved = wishlist.includes(product._id);
                const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image;

                return (
                  <motion.div
                    onClick={() => {
                      navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                      window.scrollTo(0, 0);
                    }}
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border group"
                  >
                    {/* Wishlist */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWish(product._id);
                      }}
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow"
                    >
                      {loved ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-400" />
                      )}
                    </button>

                    {/* Image */}
                    <div className="h-44 bg-gray-50 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-xs text-emerald-600 font-semibold uppercase">
                      {product.category}
                    </span>

                    <h3 className="font-bold text-gray-800 mt-1">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-sm font-semibold">
                        4.5
                      </span>
                    </div>

                    {/* Price + Cart */}
                    <div className="flex items-center justify-between mt-4">

                      <div>
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{product.offerPrice}
                        </span>
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      </div>

                      {cartItems[product._id] ? (
                        <div className="flex items-center gap-2 bg-emerald-100 px-2 py-1 rounded-lg">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(product._id);
                            }}
                            className="w-7 h-7 bg-white rounded shadow"
                          >
                            -
                          </button>

                          <span className="font-semibold">
                            {cartItems[product._id]}
                          </span>

                          <button
                            onClick={() => addToCart(product._id)}
                            className="w-7 h-7 bg-white rounded shadow"
                          >
                            +
                          </button>

                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                          }}
                          className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center"
                        >
                          <FaShoppingCart />
                        </button>
                      )}

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;