const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth, default: clerkClient, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const Cart = require('../models/Cart');

//get Cart
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(cart || { userId: req.user.id, items: [] });
});

// ADD or UPDATE item
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
        cart = new Cart({ userId: req.user.id, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
        existingItem.quantity = quantity;
    } else {
        cart.items.push({ productId, quantity });
    }
    
  await cart.save();
  res.json(cart);
});

// DELETE item
router.delete("/:productId", ClerkExpressRequireAuth(), async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
  if (cart) {
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
}
res.json(cart);
});

module.exports = router;