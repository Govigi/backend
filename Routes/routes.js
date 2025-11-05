import express from "express";
const Router = express.Router();

import * as controller_auth from "../Controller/auth.js";
import * as controller_order from "../Controller/order.js";
import * as controller_product from "../Controller/product.js";
import * as controller_template from "../Controller/templateController.js";
import * as controller_customer from "../Controller/CustomerController.js";
import * as controller_country from "../Controller/Country-State-City-Controller.js";
import * as controller_customerType from "../Controller/CustomerTypesController.js";
import * as controller_category from "../Controller/CategoriesController.js";

import upload from "../Controller/utils/upload.js";

//Testing
Router.get("/test", (req, res) => {
  console.log('api called');
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

//Customer Types
Router.post("/createCustomerType", controller_customerType.createCustomerType);
Router.get("/getAllCustomerTypes", controller_customerType.getAllCustomerTypes);

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
Router.get("/getOrder/:id", controller_order.getOrderById);

//product
Router.post(
  "/createProduct",
  upload.single("image"),
  controller_product.createProduct
);
Router.get("/getAllProducts", controller_product.getAllProducts);
Router.get("/getProductsStats", controller_product.getProductsStats);
Router.patch(
  "/updateProduct/:id",
  upload.single("image"),
  controller_product.updateProduct
);
Router.delete("/deleteProduct/:id", controller_product.deleteProduct);

//Categories
Router.post("/createCategory", upload.single("image"), controller_category.createCategoryController);
Router.get("/getAllCategories", controller_category.getAllCategoriesController);
Router.get("/getAllCategoriesStats", controller_category.getAllCategoriesStatsController);

//Countries and States
Router.get(
  "/getCountries",
  controller_country.getCountries
);

Router.get(
  "/getStates/:countryCode", controller_country.getStatesByCountry
)

Router.get(
  "/getCities/:countryCode/:stateCode",
  controller_country.getCitiesByState
);

export default Router;
