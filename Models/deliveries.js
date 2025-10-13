import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders'
    }
  ],
  deliveryManagerId: { type: String }, // admin
  status: { type: String, default: 'Scheduled' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('deliveries', deliverySchema);