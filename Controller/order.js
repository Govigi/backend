const Order = require("../Models/orders");
const User = require("../Models/users");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SCERET_KEY;
const createOrder = async (req, res) => {
  console.log("req :",req.body);
  try {
    const {
      phone,
      address,
      items,
      totalAmount,
      scheduledDate,
    } = req.body;

    if (!items) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const contact = phone;
    console.log("Items :", items)
    const newOrder = await Order.create({
      address,
      items,
      totalAmount,
      scheduledDate,
    });

    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ message: "User not found." });
    user.orders.push(newOrder._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("req :", token);
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;
    const data = await User.find({ contact }).populate('orders').sort({ createdAt: -1 });
    const orders = data[0].orders;

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createOrder, getUserOrders, updateOrderStatus, getAllOrders };
