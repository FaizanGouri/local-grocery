import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


//  axios global config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const isCartLoaded = useRef(false);

  // ================= STATE =================
  const [user, setUser] = useState();
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [address, setAddress] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user/is-auth");
    if (data.success) {
      setUser(data.user);
      fetchCart();
      fetchAddress();
      fetchOrders();
    } else {
      setUser(null);
    }
  } catch {
    setUser(null);
  }
};

  //  Fetch products from backend
    const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Product fetch failed:", error.message);
    }
  }
  // ================= SELLER AUTH =================
  const fetchSeller = async () => {
    try {
      const res = await axios.get("/api/seller/is-auth");
      setIsSeller(res.data.success);
    } catch (error) {
      console.log(error.message);
      setIsSeller(false);
    }
  };

  const refreshAuth = async () => {
  await fetchSeller();
};

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // ================= SEARCH =================

useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredProducts(products);
  } else {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }
}, [searchQuery, products]);

  // ================= CART =================
  const addToCart = (id) => {
    setCartItems((prev) => {
      const updated = {
        ...prev,
        [id]: (prev[id] || 0) + 1,
      };

      if (!prev[id]) toast.success("Added to cart");

      return updated;
    });
  };

  const updateCartItem = (id, qty) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: qty,
    }));
    toast.success("Cart updated");
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
        toast("Item removed", { icon: "🗑️" });
      }

      return updated;
    });
  };

  const deleteFromCart = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      toast("Item removed", { icon: "🗑️" });
      return updated;
    });
  };

// ================= CART FETCH =================
// User login hote hi cart fetch karo
const fetchCart = async () => {
  try {
    const { data } = await axios.get("/api/cart/get");
    if (data.success) {
      setCartItems(data.cartItems || {});
    }
  } catch (error) {
    console.error("Cart fetch failed:", error.message);
  } finally {
    isCartLoaded.current = true;
  }
};


useEffect(() => {
  if (user) {
    fetchCart();          
  } else {
    isCartLoaded.current = false;
    setCartItems({});     
  }
}, [user]);

// ================= CART SYNC TO BACKEND =================

useEffect(() => {
  if (!user || !isCartLoaded.current) return;                    

  const syncCart = async () => {
    try {
      await axios.post("/api/cart/update", { cartItems });
    } catch (error) {
      console.error("Cart sync failed:", error.message);
    }
  };

  // Debounce — 400ms baad sync
  const timer = setTimeout(syncCart, 400);
  return () => clearTimeout(timer);
}, [cartItems, user]);


// Address fetch on login
const fetchAddress = async () => {
  try {
    const { data } = await axios.get("/api/address/list");
    if (data.success && data.addresses?.length > 0) {
       setAddress(data.addresses[0]);
    }
  } catch (error) {
    console.error("Address fetch failed:", error.message);
  }
};


useEffect(() => {
  if (!user) {
    setCartItems({});
    setAddress(null);
  }
}, [user]);

  // ================= Fetch Address =================
const fetchOrders = async () => {
  try {
    const { data } = await axios.get("/api/order/user");
    if (data.success) {
      setOrders(data.orders);
    }
  } catch (error) {
    console.error("Orders fetch failed:", error.message);
  }
};



 // ================= PLACE ORDER =================
const placeOrder = async () => {
  if (!address) {
    toast.error("Add address first");
    navigate("/add-address");
    return;
  }

  if (Object.keys(cartItems).length === 0) {
    toast.error("Cart is empty");
    return;
  }

  try {
    const items = Object.keys(cartItems).map((id) => ({
      product:  id,
      quantity: cartItems[id],
    }));

    const { data } = await axios.post("/api/order/cod", {
      items,
      address: {
        firstName: address.firstName,
        lastName:  address.lastName,
        email:     address.email,
        street:    address.street,
        city:      address.city,
        state:     address.state,
        zip:       address.zip || address.zipcode,
        zipcode:   address.zip || address.zipcode,
        country:   address.country,
        phone:     address.phone,
      },
    });

    if (data.success) {
      toast.success("Order placed!");
      setCartItems({});
      await fetchOrders();
      navigate("/my-orders");
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

  // ================= CONTEXT VALUE =================
  const value = {
    user,
    setUser,
    navigate,

    isSeller,
    setIsSeller,

    showUserLogin,
    setShowUserLogin,

    searchQuery,
    setSearchQuery,
    filteredProducts,

    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    deleteFromCart,

    address,
    setAddress,

    orders,
    setOrders,
    placeOrder,

    axios,
    refreshAuth,
    
    products,
    fetchProducts,

    fetchAddress,
    fetchOrders,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// hook
export const useAppContext = () => useContext(AppContext);