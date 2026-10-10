import express from 'express';
import { upload } from '../config/multer.js';
import authSeller from '../middleware/authSeller.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,   // ✅ new
  deleteProduct,   // ✅ new
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add',    upload.array("images"), authSeller, addProduct);
productRouter.get('/list',    productList);
productRouter.get('/id',      productById);
productRouter.post('/stock',  authSeller, changeStock);
productRouter.put('/update',  authSeller, updateProduct);    // ✅ new
productRouter.delete('/delete', authSeller, deleteProduct);  // ✅ new

export default productRouter;
