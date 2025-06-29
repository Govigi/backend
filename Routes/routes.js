const express = require("express");
const Router = express.Router();

const controller_auth = require('../Controller/auth');
const controller_order = require('../Controller/order');

//post
Router.post('/sendOTP', controller_auth.send_otp);
Router.post('/verifyOTP', controller_auth.verify_otp);
Router.post('/createOrder', controller_order.createOrder);

//Get
Router.get('/userOrders/:userId', controller_order.getUserOrders);

//Put
Router.patch('/updateStatus/:id', controller_order.updateOrderStatus);

module.exports = Router;