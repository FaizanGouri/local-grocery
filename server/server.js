import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDB from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRouter.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

import './models/Product.js';
import './models/Order.js';
import './models/User.js';


const app = express();
const port = process.env.port || 4000

// Database connection
await connectDB();

//Cloudinary connection
await connectCloudinary()

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Middleware configration
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) =>{
    res.send("hello from server")
})

app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)



app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
    
})