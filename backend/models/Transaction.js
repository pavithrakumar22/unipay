import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    orders: [
        {
            id: String,
            entity: String,
            amount: Number,
            amount_paid: Number,
            amount_due: Number,
            currency: String,
            receipt: String,
            status: String,
            attempts: Number,
            created_at: Number,
            notes: Object,
            offer_id: String,
        }
    ]
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
