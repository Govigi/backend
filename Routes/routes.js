const express = require("express");
const Router = express.Router();

const { getUpload } = require('../Controller/utils/upload');
const controller_auth = require('../Controller/auth');
const controller_order = require('../Controller/order');
const controller_product = require('../Controller/product');
const controller_image = require('../Controller/image');

//Auth
Router.post('/sendOTP', controller_auth.send_otp);
Router.post('/verifyOTP', controller_auth.verify_otp);
Router.post('/completeProfile', controller_auth.completeProfile);
Router.patch('/addAddress', controller_auth.addAddress);

//order
Router.get('/userOrders/:userId', controller_order.getUserOrders);
Router.patch('/updateStatus/:id', controller_order.updateOrderStatus);
Router.post('/createOrder', controller_order.createOrder);

//product
// Router.post('/createProduct', getUpload().single("image"), controller_product.createProduct);

Router.post("/createProduct", (req, res, next) => {
  const upload = getUpload();
  upload.single("image")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: "Upload failed", error: err.message });
    }
    controller_product.createProduct(req, res);
  });
});

Router.get("/getAllProducts", controller_product.getAllProducts);
Router.patch('/updateProduct/:id', controller_product.updateProduct);

//image
Router.get('/image/:filename', controller_image.getImageByFilename);

module.exports = Router;