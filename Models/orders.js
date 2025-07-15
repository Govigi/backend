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
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    scheduledDate: { type: Date },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
