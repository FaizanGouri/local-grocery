import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ================================
    PLACE ORDER (COD ONLY) : /api/order/cod
================================ */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    let subtotal = 0;

    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error("Product not found");
        }

        subtotal += product.offerPrice * item.quantity;

        return {
          product: item.product,
          quantity: item.quantity,
        };
      })
    );

    //  tax = 2%
    const tax = subtotal * 0.02;

    const totalAmount = subtotal + tax;

    const order = await Order.create({
      userId,
      items: formattedItems,
      amount: totalAmount,
      address,
      paymentType: "COD",
      isPaid: false,
      status: "processing",
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ================================
    GET USER ORDERS : /api/order/user
================================ */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ================================
    GET ALL ORDERS (ADMIN/SELLER) /api/order/seller
================================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


/* ================================
    UPDATE ORDER STATUS
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    await Order.findByIdAndUpdate(orderId, { status });
    
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};