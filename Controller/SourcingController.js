import Order from "../Models/orders.js";
import Vendor from "../Models/Vendor.js";

// Get vendors. If lat/lng provided, sort by distance. Otherwise return all active.
const getNearbyVendors = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        let query = { isActive: true };
        let vendors = [];

        if (lat && lng) {
            // Geo-spatial query
            // Ensure 2dsphere index exists on 'address.location'
            vendors = await Vendor.find({
                isActive: true,
                "address.location": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        }
                    }
                }
            });
        } else {
            // Just return all active vendors if no coords
            vendors = await Vendor.find(query).sort({ businessName: 1 });
        }

        res.status(200).json(vendors);
    } catch (error) {
        console.error("Get Nearby Vendors Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const assignOrdersToVendor = async (req, res) => {
    try {
        const { vendorId, orderIds } = req.body;

        if (!vendorId || !orderIds || !Array.isArray(orderIds)) {
            return res.status(400).json({ message: "Vendor ID and Order IDs array are required." });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        // Update Orders
        const result = await Order.updateMany(
            { _id: { $in: orderIds } },
            {
                $set: {
                    vendorId: vendorId,
                    sourcingStatus: "Assigned"
                }
            }
        );

        res.status(200).json({
            message: "Orders assigned successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Assign Orders Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export { getNearbyVendors, assignOrdersToVendor };
