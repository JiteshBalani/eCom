const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//Add a product
router.post('/add-product', async(req,res) => {
    try{
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send({
            success: true,
            message: 'New product added!'
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

//Get all products
router.get('/get-all-products', async(req,res) => { 
    try{
        const allProducts = await Product.find();
        res.send({
            success: true,
            message: 'All Products',
            data: allProducts
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

//Update a product
router.put('/update-product/:_id', async(req,res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params._id, req.body);
        const updatedProduct = await Product.findById(req.params._id);
        res.send({
            success: true,
            message: 'Product updated successfully!',
            data: updatedProduct
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

//Delete a product
router.delete('/delete-product/:_id', async(req,res) => {
    try{
        await Product.findByIdAndDelete(req.params._id);
        res.send({
            success: true,
            message: 'Product deleted successfully!'
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

//Fetch a single product
router.get('/product/:_id', async(req,res) => {
    try{
        const product = await Product.findById(req.params._id);
        res.send({
            success: true,
            message: 'Product fetched successfully!',
            data: product
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

module.exports = router;