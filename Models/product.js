import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    pricePerKg: { type: Number, required: true },
    stock: {
      type: String,
      enum: ['Available', 'Out of Stock'],
      required: true,
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    image: {
      url: { type: String },
      public_id: { type: String }
    },
    availableStock: { type: String},
    currentStock: {type: Number},
    minimumThreshold: {type: Number}
  },{timestamps: true}
);

export default mongoose.model('product', productSchema);
