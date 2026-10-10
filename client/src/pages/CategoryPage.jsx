import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaShoppingCart, FaStar } from "react-icons/fa";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, products } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  const targetCategory = (categoryName || "").toLowerCase();
  const filtered = products.filter((item) => {
    const itemCat = (item.category || "").toLowerCase();
    return (
      itemCat === targetCategory ||
      (targetCategory === "drinks" && (itemCat === "beverages" || itemCat === "drink")) ||
      (targetCategory === "beverages" && (itemCat === "drinks" || itemCat === "drink")) ||
      (targetCategory === "instant" && (itemCat === "snacks" || itemCat === "snack")) ||
      (targetCategory === "snacks" && (itemCat === "instant" || itemCat === "snack"))
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-emerald-600 transition"
            >
              Home
            </span>
            <span>/</span>
            <span className="text-emerald-600">Category</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">
              {categoryName} Products
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {filtered.length} {filtered.length === 1 ? "item found" : "items found"}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">🛒</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                No products found in this category
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                We are restocking our grocery shelves soon!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition shadow-md"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            filtered.map((product) => {
              const isOutOfStock =
                product.inStock === false ||
                (product.stockQuantity !== undefined && product.stockQuantity <= 0);
              const imgSrc = Array.isArray(product.image)
                ? product.image[0]
                : product.image;

              return (
                <div
                  key={product._id}
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${product._id}`
                    );
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between group cursor-pointer relative"
                >
                  {isOutOfStock && (
                    <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
                      Out of stock
                    </div>
                  )}

                  <div>
                    <div className="h-44 bg-gray-50 rounded-xl overflow-hidden mb-3">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition ${
                          isOutOfStock ? "grayscale opacity-75" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-xs font-semibold text-gray-700">
                        {product.rating ? Number(product.rating).toFixed(1) : "4.5"}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-base font-bold text-emerald-600">
                        ₹{product.offerPrice}
                      </span>
                      {product.price > product.offerPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                        Sold Out
                      </span>
                    ) : cartItems[product._id] ? (
                      <div className="flex items-center gap-2 bg-emerald-100 px-2 py-1 rounded-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(product._id);
                          }}
                          className="w-6 h-6 bg-white rounded shadow font-bold text-gray-700 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="font-semibold text-xs text-gray-800">
                          {cartItems[product._id]}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                          }}
                          className="w-6 h-6 bg-white rounded shadow font-bold text-gray-700 hover:bg-gray-100"
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
                        className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow transition"
                      >
                        <FaShoppingCart className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
