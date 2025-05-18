const { ClerkExpressRequireAuth, default: clerkClient } = require('@clerk/clerk-sdk-node');
const Cart = require("../models/Cart");
const router = require("express").Router();

//CREATE
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:_id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:_id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params._id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;