import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: {type: Number,default: 1000},
}, { timestamps: true });

export default mongoose.model("User", userSchema);
