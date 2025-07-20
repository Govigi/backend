const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> a6a982be39d469d82b4fa0c608fcd2a15a6efef0
  }
);

module.exports = mongoose.model('product', productSchema);
