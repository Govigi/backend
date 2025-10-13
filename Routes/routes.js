const express = require("express");
const Router = express.Router();

const controller_auth = require("../Controller/auth");
const controller_order = require("../Controller/order");
const controller_product = require("../Controller/product");
const controller_template = require("../Controller/templateController");

const upload = require("../Controller/utils/upload");

//Testing
Router.get("/test", (req, res) => {
  res.send("API is working");
});

// Admin login
Router.post("/admin/login", controller_auth.adminLogin);

//Auth
Router.post("/sendOTP", controller_auth.send_otp);
Router.post("/verifyOTP", controller_auth.verify_otp);
Router.post("/completeProfile", controller_auth.completeProfile);

//Address
Router.post("/addAddress", controller_auth.addAddress);
Router.patch("/editAddress", controller_auth.editAddress);
Router.post("/getAddress", controller_auth.getAddress);
Router.post("/deleteAddress", controller_auth.deleteAddress);

//Wishlist
Router.post("/getWishlist", controller_auth.getWishlist);
Router.post("/togglewish", controller_auth.toggleWishlist);

//template
Router.post("/createTemplate", controller_template.createTemplate);

//order
Router.post("/userOrders", controller_order.getUserOrders);
Router.patch("/updateStatus/:id", controller_order.updateOrderStatus);
Router.post("/createOrder", controller_order.createOrder);
Router.get("/getAllOrders", controller_order.getAllOrders);

//product
Router.post(
  "/createProduct",
  upload.single("image"),
  controller_product.createProduct
);
Router.get("/getAllProducts", controller_product.getAllProducts);
Router.patch(
  "/updateProduct/:id",
  upload.single("image"),
  controller_product.updateProduct
);
Router.delete("/deleteProduct/:id", controller_product.deleteProduct);

module.exports = Router;
