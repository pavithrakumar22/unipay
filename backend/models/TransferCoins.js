import mongoose from "mongoose";

const TransferCoinsSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  transactions: [
    {
      type: { type: String, enum: ["debited", "credited"], required: true },
      amount: { type: Number, required: true },
      username: { type: String, required: true }
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("TransferCoins", TransferCoinsSchema);
