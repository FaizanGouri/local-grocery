import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { cartItems, addToCart, removeFromCart, products } = useAppContext(); // ✅ products AppContext se

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ✅ Ab real backend products filter ho rahe hain
    const filtered = products.filter(
        (item) => item.category.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <div className="min-h-screen pt-24 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <h2 className="text-3xl font-bold mb-8 text-gray-800 capitalize">
                    {categoryName} Products
                </h2>

                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {filtered.length === 0 ? (
                        <p>No products found 😢</p>
                    ) : (
                        filtered.map((product) => (
                            <div key={product._id} className="bg-white p-4 rounded-xl shadow">

                                <img
                                    src={Array.isArray(product.image) ? product.image[0] : product.image} // ✅ safe access
                                    className="w-full h-40 object-cover rounded-lg"
                                />

                                <h3 className="mt-2 font-semibold">{product.name}</h3>

                                <p className="text-emerald-600 font-bold">
                                    ₹{product.offerPrice}
                                </p>

                                {/* Cart */}
                                {cartItems[product._id] ? (
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => removeFromCart(product._id)}>-</button>
                                        <span>{cartItems[product._id]}</span>
                                        <button onClick={() => addToCart(product._id)}>+</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center"
                                    >
                                        <FaShoppingCart />
                                    </button>
                                )}

                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
