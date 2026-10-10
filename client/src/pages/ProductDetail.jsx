// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const { id } = useParams();
    const {
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        navigate,
        user,
        setShowUserLogin,
        products,
        axios,
        fetchProducts,
    } = useAppContext();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Reviews state
    const [reviewsList, setReviewsList] = useState([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        // ✅ dummyProducts ki jagah real products se dhundho
        if (!products || products.length === 0) return; // products load hone ka wait karo

        const found = products.find((p) => p._id === id);
        if (found) {
            setProduct(found);
            setReviewsList(found.reviews || []);
            setSelectedImage(0);
            setImageLoaded(false);

            const related = products.filter(
                (p) => p.category === found.category && p._id !== found._id
            );
            setRelatedProducts(related.slice(0, 4));
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id, products]); // ✅ products bhi dependency mein

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        if (!reviewComment.trim()) {
            toast.error("Please enter your review comment");
            return;
        }
        setSubmittingReview(true);
        try {
            const { data } = await axios.post("/api/product/review", {
                productId: product._id,
                rating: Number(reviewRating),
                comment: reviewComment.trim(),
            });
            if (data.success) {
                toast.success("Thank you! Review submitted.");
                setReviewsList(data.reviews || []);
                setProduct((prev) => ({
                    ...prev,
                    rating: data.rating,
                    numReviews: data.numReviews,
                    reviews: data.reviews,
                }));
                setReviewComment("");
                setReviewRating(5);
                if (fetchProducts) fetchProducts();
            } else {
                toast.error(data.message || "Failed to submit review");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    // ✅ Loading state — products fetch ho rahe hain
    if (!product && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // ✅ Product nahi mila
    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-2xl">😢</p>
                <p className="text-gray-600 font-semibold">Product not found</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-semibold"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const images = product.image || [product.image];
    const imageList = Array.isArray(images) ? images : [images];
    const quantity = cartItems[product._id] || 0;
    const inCart = quantity > 0;

    const discountPercent = product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    const isOutOfStock = product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        addToCart(product._id);
    };

    const handleIncrement = () => addToCart(product._id);
    const handleDecrement = () => removeFromCart(product._id);
    const handleQuantityInput = (value) => {
        const num = parseInt(value);
        if (num > 0) updateCartItem(product._id, num);
        else if (num === 0 || value === "") updateCartItem(product._id, 0);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
            >
                <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
                    <span>/</span>
                    <Link
                        to={`/category/${product.category?.toLowerCase()}`}
                        className="hover:text-primary transition-colors duration-200"
                    >
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>
            </motion.div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

                    {/* LEFT — Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col-reverse sm:flex-row gap-4"
                    >
                        {imageList.length > 1 && (
                            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px]">
                                {imageList.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setSelectedImage(idx); setImageLoaded(false); }}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === idx
                                                ? "border-emerald-500 shadow-md"
                                                : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <div className="flex-1 relative">
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                                {discountPercent > 0 && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -12 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
                                        className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                                    >
                                        {discountPercent}% OFF
                                    </motion.div>
                                )}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
                                )}
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        src={imageList[selectedImage]}
                                        alt={product.name}
                                        onLoad={() => setImageLoaded(true)}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full object-contain p-6"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT — Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                        className="flex flex-col"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3"
                        >
                            {product.category}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
                        >
                            {product.name}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 mt-3"
                        >
                            <div className="flex items-center gap-0.5">{renderStars(product.rating || 4)}</div>
                            <span className="text-sm text-gray-500">({product.rating || 4.0})</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="mt-5 flex items-end gap-3 flex-wrap"
                        >
                            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                                ₹{product.offerPrice || product.price}
                            </span>
                            {product.offerPrice && product.offerPrice < product.price && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                        Save ₹{(product.price - product.offerPrice).toFixed(0)}
                                    </span>
                                </>
                            )}
                        </motion.div>

                        {product.unit && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-gray-500 mt-2"
                            >
                                Per {product.unit}
                            </motion.p>
                        )}

                        <div className="border-t border-gray-200 my-6" />

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-600 leading-relaxed text-sm sm:text-base"
                        >
                            {/* ✅ description array bhi ho sakta hai backend se */}
                            {Array.isArray(product.description)
                                ? product.description.join(" ")
                                : product.description || "Premium quality product sourced from trusted suppliers."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="flex flex-wrap gap-2 mt-5"
                        >
                            {["Fresh", "Organic", "No Preservatives"].map((tag, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Quantity + Cart */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8"
                        >
                            {isOutOfStock ? (
                                <div className="flex flex-col gap-2">
                                    <button
                                        disabled
                                        className="w-full sm:w-auto px-10 py-3.5 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed select-none border border-gray-300"
                                    >
                                        Out of Stock
                                    </button>
                                    <span className="text-xs text-rose-500 font-medium">This product is currently out of stock and cannot be ordered.</span>
                                </div>
                            ) : !inCart ? (
                                <div className="flex flex-col gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleAddToCart}
                                        className="w-full sm:w-auto px-10 py-3.5 bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        Add to Cart
                                    </motion.button>
                                    {product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                                        <span className="text-xs text-amber-600 font-semibold">Only {product.stockQuantity} items left in stock — order soon!</span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <motion.button
                                            whileTap={{ scale: 0.85 }}
                                            onClick={handleDecrement}
                                            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                        >
                                            −
                                        </motion.button>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={quantity}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 10, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className="w-12 text-center font-bold text-gray-800 text-lg select-none"
                                            >
                                                {quantity}
                                            </motion.span>
                                        </AnimatePresence>
                                        <motion.button
                                            whileTap={{ scale: 0.85 }}
                                            onClick={handleIncrement}
                                            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 cursor-pointer"
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate("/cart")}
                                        className="px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-200 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        View Cart
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>

                        {/* Delivery Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8"
                        >
                            {[
                                { title: "Free Delivery", desc: "Orders ₹500+" },
                                { title: "Easy Returns",  desc: "7-day policy" },
                                { title: "100% Secure",   desc: "Safe payments" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 bg-white p-3 rounded-xl border border-gray-100 text-center">
                                    <span className="text-xs font-semibold text-gray-800">{item.title}</span>
                                    <span className="text-[11px] text-gray-400">{item.desc}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-16"
                >
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        {["description", "reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 capitalize cursor-pointer ${
                                    activeTab === tab
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
                        >
                            {activeTab === "description" ? (
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-600 leading-relaxed">
                                        {Array.isArray(product.description)
                                            ? product.description.join(" ")
                                            : product.description || "Premium quality product carefully sourced from trusted organic farms."}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                        {[
                                            { label: "Category",   value: product.category },
                                            { label: "Stock",      value: product.inStock !== false ? "In Stock" : "Out of Stock" },
                                            { label: "Unit",       value: product.unit || "1 pc" },
                                            { label: "Shelf Life", value: "3-5 days" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between py-2.5 border-b border-gray-100">
                                                <span className="text-sm text-gray-400">{item.label}</span>
                                                <span className="text-sm font-medium text-gray-700">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Reviews List */}
                                    <div className="space-y-6">
                                        {reviewsList.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <p className="text-2xl mb-2">⭐</p>
                                                <p className="text-sm font-semibold text-gray-700">No reviews yet</p>
                                                <p className="text-xs text-gray-400 mt-1">Be the first to share your experience with this grocery item!</p>
                                            </div>
                                        ) : (
                                            reviewsList.map((review, i) => (
                                                <motion.div
                                                    key={review._id || i}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex gap-4 pb-5 border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                                                        {(review.name || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <span className="font-semibold text-gray-800 text-sm">{review.name || "Customer"}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {review.createdAt
                                                                    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                                                                          year: "numeric",
                                                                          month: "short",
                                                                          day: "numeric",
                                                                      })
                                                                    : "Verified Customer"}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-0.5 mt-1">{renderStars(review.rating)}</div>
                                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                            {review.comment || review.text}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>

                                    {/* Write Review Form */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h4 className="text-base font-bold text-gray-800 mb-3">
                                            {user ? "Write a Review" : "Sign In to Write a Review"}
                                        </h4>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                                    Your Rating
                                                </label>
                                                <div className="flex items-center gap-1.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewRating(star)}
                                                            className="p-1 hover:scale-110 transition cursor-pointer"
                                                        >
                                                            <FaStar
                                                                className={`text-xl ${
                                                                    star <= reviewRating
                                                                        ? "text-amber-400"
                                                                        : "text-gray-200"
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                    <span className="text-xs font-semibold text-gray-500 ml-2">
                                                        {reviewRating} out of 5 stars
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                                    Your Review / Feedback
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="Tell others about freshness, packaging, and quality..."
                                                    className="w-full text-sm rounded-xl border border-gray-200 p-3.5 focus:border-emerald-500 focus:outline-none transition resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50 cursor-pointer"
                                            >
                                                {submittingReview
                                                    ? "Submitting..."
                                                    : user
                                                    ? "Submit Review"
                                                    : "Sign In & Submit"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="mt-16 mb-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Related Products</h2>
                            <Link
                                to={`/category/${product.category?.toLowerCase()}`}
                                className="text-sm text-emerald-600 font-medium hover:underline"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((item, i) => {
                                const itemQty = cartItems[item._id] || 0;
                                const itemImages = Array.isArray(item.image) ? item.image : [item.image];

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 + i * 0.08 }}
                                        whileHover={{ y: -4 }}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                                        onClick={() => navigate(`/products/${item.category.toLowerCase()}/${item._id}`)}
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            <img
                                                src={itemImages[0]}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3.5">
                                            <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-end gap-1.5">
                                                    <span className="text-base font-bold text-emerald-600">
                                                        ₹{item.offerPrice || item.price}
                                                    </span>
                                                    {item.offerPrice && item.offerPrice < item.price && (
                                                        <span className="text-xs text-gray-400 line-through">₹{item.price}</span>
                                                    )}
                                                </div>
                                                {itemQty === 0 ? (
                                                    <motion.button
                                                        whileTap={{ scale: 0.85 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!user) { setShowUserLogin(true); return; }
                                                            addToCart(item._id);
                                                        }}
                                                        className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        +
                                                    </motion.button>
                                                ) : (
                                                    <div className="flex items-center gap-1 bg-emerald-100 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeFromCart(item._id)} className="w-7 h-7 flex items-center justify-center text-emerald-700 cursor-pointer">−</motion.button>
                                                        <span className="text-sm font-bold text-emerald-700 w-5 text-center">{itemQty}</span>
                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => addToCart(item._id)} className="w-7 h-7 flex items-center justify-center text-emerald-700 cursor-pointer">+</motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
