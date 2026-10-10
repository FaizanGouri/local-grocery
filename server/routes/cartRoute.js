import mongoose from "mongoose";
import express from "express";
import authUser from "../middleware/authUser.js";
import { getCart, updateCart } from '../controllers/cartControllers.js';


const cartRouter = express.Router();

cartRouter.get('/get', authUser, getCart)  

cartRouter.post('/update', authUser, updateCart)

export default cartRouter