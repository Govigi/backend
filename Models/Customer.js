import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, unique: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerCity: { type: String, required: true },
    customerState: { type: String, required: true },
    customerZip: { type: String, required: true },
    customerCountry: { type: String, required: true },
    customerContactPerson: { type: String, required: true },
    customerStatus: { type: String, enum: ['active', 'inactive','pending'], default: 'pending' },
    customerType:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'CustomerType',
        required: true
    }
},{timestamps: true});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;