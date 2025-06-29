const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
        userId: { type: String, required: true },
        items: [
            {
                productId: { type: String, required: true },
                quantityKg: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, default: 'Pending' },
        scheduledDate: { type: Date }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('orders', orderSchema);