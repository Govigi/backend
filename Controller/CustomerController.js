import customerService from "../Services/CustomerService.js";

const createCustomerController = async (req, res) => {
    try {
        const customerData = req.body;
        const newCustomer = await customerService.createCustomer(customerData);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCustomerByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCustomersController = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCustomersCountController = async (req, res) => {
    try {
        const count = await customerService.getAllCustomersCount();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCustomersStatsController = async (req, res) => {
    try {
        const stats = await customerService.getAllCustomersStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createCustomerController, getCustomerByIdController, getAllCustomersController, getAllCustomersCountController, getAllCustomersStatsController };