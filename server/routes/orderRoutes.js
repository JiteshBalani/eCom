const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth, default: clerkClient } = require('@clerk/clerk-sdk-node')
const Order = require("../models/Order");

//CREATE
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
