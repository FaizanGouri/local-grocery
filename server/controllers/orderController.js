import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

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
    const formattedItems = [];
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      if (product.inStock === false) {
        return res.json({
          success: false,
          message: `"${product.name}" is currently out of stock`,
        });
      }

      const currentStock = product.stockQuantity !== undefined ? product.stockQuantity : 50;
      if (currentStock < item.quantity) {
        return res.json({
          success: false,
          message: `Only ${currentStock} item(s) left in stock for "${product.name}"`,
        });
      }

      subtotal += product.offerPrice * item.quantity;
      formattedItems.push({
        product: item.product,
        quantity: item.quantity,
      });

      const newStock = Math.max(0, currentStock - item.quantity);
      productsToUpdate.push({
        product,
        newStock,
        inStock: newStock > 0,
      });
    }

    // Decrement stock in database
    for (const update of productsToUpdate) {
      update.product.stockQuantity = update.newStock;
      update.product.inStock = update.inStock;
      await update.product.save();
    }

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

    // Clear user cart in database after successful order
    await User.findByIdAndUpdate(userId, { cartItems: {} });

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
    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    // If order is changing to cancelled and wasn't already cancelled, restock products
    if (status?.toLowerCase() === "cancelled" && existingOrder.status?.toLowerCase() !== "cancelled") {
      for (const item of existingOrder.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stockQuantity = (product.stockQuantity || 0) + item.quantity;
          product.inStock = true;
          await product.save();
        }
      }
    }

    existingOrder.status = status;
    await existingOrder.save();

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ================================
    CANCEL USER ORDER : /api/order/cancel
================================ */
export const cancelUserOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Check ownership
    if (order.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    const currentStatus = (order.status || "").toLowerCase();
    if (currentStatus === "cancelled") {
      return res.json({ success: false, message: "Order is already cancelled" });
    }

    if (
      currentStatus === "shipped" ||
      currentStatus === "out-for-delivery" ||
      currentStatus === "delivered"
    ) {
      return res.json({
        success: false,
        message: "Order cannot be cancelled once it is shipped or delivered",
      });
    }

    // Restock products
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockQuantity = (product.stockQuantity || 0) + item.quantity;
        product.inStock = true;
        await product.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};