const mongoose = require('mongoose');

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

module.exports = mongoose.model('deliveries', deliverySchema);