import { cloudinary } from "../config/cloudinary.js";
import Product from "../models/Product.js";

// Add Product : POST /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch {
      return res.json({ success: false, message: "Invalid product data" });
    }

    const images = req.files || [];

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Products : GET /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Product : GET /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change inStock : POST /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ NEW — Update Product : PUT /api/product/update
export const updateProduct = async (req, res) => {
  try {
    const { id, price, offerPrice, inStock } = req.body;
    if (!id) return res.json({ success: false, message: "Product ID required" });

    await Product.findByIdAndUpdate(id, { price, offerPrice, inStock });
    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ NEW — Delete Product : DELETE /api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: "Product ID required" });

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
