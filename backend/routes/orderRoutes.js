// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

router.post("/place", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save order." });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;
