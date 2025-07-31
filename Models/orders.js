const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        quantityKg: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: [
      {
        city: {type: String},
        contact: {type: String},
        email: {type: String},
        landmark: {type: String},
        name: {type: String},
        pincode: {type: String},
        state: {type: String}
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    name: {type: String},
    contact: {type: String},
    paymentMethod: {type: String},
    scheduledDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
