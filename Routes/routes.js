import express from "express";
const Router = express.Router();

import * as controller_auth from "../Controller/auth.js";
import * as controller_order from "../Controller/order.js";
import * as controller_product from "../Controller/product.js";
import * as controller_template from "../Controller/templateController.js";
import * as controller_customer from "../Controller/CustomerController.js";

import upload from "../Controller/utils/upload.js";

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

//Customer
Router.post("/createCustomer", controller_customer.createCustomerController);
Router.get("/getCustomer/:id", controller_customer.getCustomerByIdController);
Router.get("/getAllCustomers", controller_customer.getAllCustomersController);
Router.get("/getAllCustomersCount", controller_customer.getAllCustomersCountController);

Router.get("/getAllCustomersStats", controller_customer.getAllCustomersStatsController);

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

export default Router;
