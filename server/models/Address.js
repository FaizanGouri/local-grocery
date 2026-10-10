import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName:  { type: String },               
    email:     { type: String, required: true },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    state:     { type: String },                
    zip:       { type: String, required: true },
    country:   { type: String, required: true },
    phone:     { type: String },                
  },
  { timestamps: true }
);

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;