import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true
    },
    orderNumber: { type: String, unique: true, sparse: true },
    driverId: { type: String }, // ID of the assigned driver/user
    assignedAt: { type: Date },
    items: [
      {
        productId: { type: String, required: true },
        quantityKg: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true }
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
      required: true
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    name: { type: String },
    contact: { type: String },
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: "Pending" },
    scheduledDate: { type: Date },
    scheduledTimeSlot: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("orders", orderSchema);
