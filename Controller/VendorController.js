import Vendor from "../Models/Vendor.js";

// Create a new vendor
export const createVendor = async (req, res) => {
    try {
        const { businessName, contactPerson, email, phone, address, bankDetails, isActive } = req.body;

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Vendor with this email already exists" });
        }

        const newVendor = new Vendor({
            businessName,
            contactPerson,
            email,
            phone,
            address, // Expecting rich address object from frontend
            bankDetails,
            isActive
        });

        const savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(500).json({ message: "Error creating vendor", error: error.message });
    }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendors", error: error.message });
    }
};

// Get single vendor by ID
export const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor details", error: error.message });
    }
};

// Update vendor
export const updateVendor = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(updatedVendor);
    } catch (error) {
        res.status(500).json({ message: "Error updating vendor", error: error.message });
    }
};

// Delete vendor (Optional, usually just deactivate)
export const deleteVendor = async (req, res) => {
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!deletedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting vendor", error: error.message });
    }
};
