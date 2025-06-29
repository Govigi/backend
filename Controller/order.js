const Order = require('../Models/orders');
const User = require('../Models/users');

const createOrder = async (req, res) => {
  try {
    const { name, email, businessType, address, userId, items, totalAmount, scheduledDate } = req.body;

    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByIdAndUpdate( userId,
        {
            name,
            address,
            email,
            businessType
        },
        {
            new: true
        }
    );

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      scheduledDate,
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } 
  catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });


    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } 
  catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } 
  catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createOrder , getUserOrders , updateOrderStatus };
