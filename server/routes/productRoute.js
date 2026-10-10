import express from 'express';
import { upload } from '../config/multer.js';
import authSeller from '../middleware/authSeller.js';
import authUser from '../middleware/authUser.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
  deleteProduct,
  addProductReview,
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add',    authSeller, upload.array("images"), addProduct);
productRouter.get('/list',    productList);
productRouter.get('/id',      productById);
productRouter.post('/stock',  authSeller, changeStock);
productRouter.put('/update',  authSeller, updateProduct);
productRouter.delete('/delete', authSeller, deleteProduct);
productRouter.post('/review', authUser, addProductReview);

export default productRouter;
