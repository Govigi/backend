const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    pricePerKg: { type: Number, required: true },
    stock: {
      type: String,
      enum: ['Available', 'Out of Stock'],
      required: true,
    },
    image: {
      url: { type: String },
      public_id: { type: String }
    },
    availableStock: { type: String},
    timestamp: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('product', productSchema);
