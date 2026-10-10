import express from "express";
import authUser from "../middleware/authUser.js";
import {
  addAddress,
  getUserAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

//  Add new address
addressRouter.post("/add", authUser, addAddress);

//  Get all addresses (user-specific)
addressRouter.get("/list", authUser, getUserAddress);

// Delete address
addressRouter.delete("/delete/:id", authUser, deleteAddress);

// Update address
addressRouter.put("/update/:id", authUser, updateAddress);

export default addressRouter;