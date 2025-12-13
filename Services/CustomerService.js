import Customer from "../Models/Customer.js";
import BaseRepository from "../Repository/BaseRepository.js";

class CustomerService extends BaseRepository {
    constructor() {
        super(Customer);
    }

    async createCustomer(data) {
        return await this.create(data);
    }

    async updateCustomer(id, data) {
        return await Customer.findByIdAndUpdate(id, data, { new: true });
    }

    async getCustomerById(id) {
        return await Customer.findById(id).populate("customerType", "typeName").populate("customerAddress");
    }

    async getAllCustomers() {
        return await Customer.find()
            .populate("customerType", "typeName")
            .populate("customerAddress")
            .sort({ createdAt: -1 });
    }

    async getAllCustomersStats() {
        const totalCustomers = await Customer.countDocuments();
        const activeCustomers = await Customer.countDocuments({ customerStatus: "active" });
        const pendingApprovals = await Customer.countDocuments({ customerStatus: "pending" });

        let totalOrders = 0;
        if (typeof (await import("../Models/orders.js")).default === "function") {
            const Order = (await import("../Models/orders.js")).default;
            totalOrders = await Order.countDocuments();
        }

        return {
            totalCustomers,
            activeCustomers,
            pendingApprovals,
            totalOrders
        };
    }

}

export default new CustomerService();