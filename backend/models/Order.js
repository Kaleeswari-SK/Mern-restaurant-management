// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  shipping: {
    streetNo: String,
    streetName: String,
    city: String,
    district: String,
    pinCode: String,
  },
  cartItems: [
    {
      item: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
