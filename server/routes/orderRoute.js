import express from "express";
import authUser from "../middleware/authUser.js";
import {
  placeOrderCOD,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelUserOrder,
} from "../controllers/orderController.js";
import authSeller from "../middleware/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.post("/cancel", authUser, cancelUserOrder);
orderRouter.get("/all", authSeller, getAllOrders); 
orderRouter.post("/status", authSeller, updateOrderStatus);

export default orderRouter;