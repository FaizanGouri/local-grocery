import { cloudinary } from "../config/cloudinary.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

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

// ✅ NEW — Add or Update Product Review : POST /api/product/review
export const addProductReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.json({
        success: false,
        message: "Product ID, rating, and comment are required",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(userId);
    const reviewerName = user ? user.name : "Customer";

    if (!product.reviews) {
      product.reviews = [];
    }

    const existingIndex = product.reviews.findIndex(
      (r) => r.userId && r.userId.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      product.reviews[existingIndex].rating = numRating;
      product.reviews[existingIndex].comment = comment;
      product.reviews[existingIndex].createdAt = new Date();
    } else {
      product.reviews.push({
        userId,
        name: reviewerName,
        rating: numRating,
        comment,
        createdAt: new Date(),
      });
    }

    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));
    product.numReviews = product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: "Review added successfully",
      rating: product.rating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
