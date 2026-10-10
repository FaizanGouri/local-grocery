import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 50 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.models.product ||
  mongoose.model("Product", productSchema);

// Also register lower-case alias if needed
if (!mongoose.models.product) {
  mongoose.model("product", productSchema);
}

export default Product;