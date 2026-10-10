import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";


import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import {Toaster} from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Auth from "./components/Auth";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrder";
import SellerLogin from "./components/seller/SellerLogin";
import SellerDashboard from "./pages/seller/SellerDashboard";





function App() {
  const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2800);
        return () => clearTimeout(timer);
      }, []);

      const isSellerPath = useLocation().pathname.includes("seller");
      const {showUserLogin, isSeller} = useAppContext()
  return (
    <>
      {loading && <Loader />}
      <div
        className={`transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {isSellerPath ? null:<Navbar />}
        {showUserLogin ? <Auth /> : null}
        
        <Toaster />

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/products/:category/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/seller" element ={isSeller ? <SellerDashboard /> : <SellerLogin />}>

            </Route>
          </Routes>
        </div>
        
        {isSellerPath ? null : <Footer />}
      </div>
    </>
  );
}

export default App;