import mongoose from "mongoose";

const CoinsSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    coins: { type: Number, default: 0 },
});

const Coins = mongoose.model("Coins", CoinsSchema);
export default Coins;
