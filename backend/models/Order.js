import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    entity: { type: String },
    amount: { type: Number, required: true },
    amount_paid: { type: Number, default: 0 },
    amount_due: { type: Number, default: 0 },
    currency: { type: String, required: true },
    receipt: { type: String },
    status: { type: String },
    attempts: { type: Number },
    created_at: { type: Number },
    notes: { type: Object },
    offer_id: { type: String }
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
