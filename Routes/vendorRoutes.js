import express from "express";
import * as vendorController from "../Controller/VendorController.js";
import authMiddleware from "../MiddleWears/authMiddleWear.js";

const router = express.Router();

// Apply authMiddleware to protect all vendor routes
// Assuming only admin or authorized users should access these
router.post("/create", authMiddleware, vendorController.createVendor);
router.get("/getAll", authMiddleware, vendorController.getAllVendors);
router.get("/get/:id", authMiddleware, vendorController.getVendorById);
router.patch("/update/:id", authMiddleware, vendorController.updateVendor);
router.delete("/delete/:id", authMiddleware, vendorController.deleteVendor);

export default router;
