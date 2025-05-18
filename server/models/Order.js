const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
        productName: { type: String }, 
        imageURL: { type: String },    
        salePrice: { type: Number }
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    phone: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);