const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true }, // Добавлено поле подкатегории
    price: { type: Number, required: true },
    color: { type: String },
    sizes: { type: Array },
    image_url: { type: String },
    description: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;