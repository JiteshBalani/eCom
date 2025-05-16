const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true},
    salePrice : {type: Number, required: true},
    mrp: {type: Number, required: true},
    description: {type: String, required: true},
    services: {type: String, default: '1 Year Warranty from the date of purchase.'},
    ratings: {type: Number, default: 0 },
    numOfRatings: {type: Number, default: 0},
    imageURL: {type: [String], required: true},
    category: {type: String, required: true},
    stock: {
        type: Number, 
        default: 100, 
        maxLength:[5, 'Stock cannot exceed 5 digits'],},
    cod: {type: Boolean, default: true},
    featured: {type: Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
