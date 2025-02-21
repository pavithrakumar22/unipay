import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    description: {type: String,required: true},
    password: { type: String, required: true },
    coins: {type: Number, default: 10000},
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);
export default Business;