import User from "../models/User.js"


// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("cartItems");
    res.json({ success: true, cartItems: user.cartItems || {} });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};