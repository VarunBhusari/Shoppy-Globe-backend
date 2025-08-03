const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    imageUrls: [String],
    category: { type: String, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
