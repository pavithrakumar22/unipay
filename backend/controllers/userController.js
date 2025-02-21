import asyncHandler from "express-async-handler";
import { registerUser, loginUser } from "../services/userService.js";
import User from "../models/userModel.js";


export const signup = asyncHandler(async (req, res) => {
  const { username, phone, password } = req.body;
  if (!username || !phone || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await registerUser({ username, phone, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const signin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await loginUser({ username, password });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



export const transferCoins = async (req, res) => {
  try {
    const { senderId, receiverIdentifier, amount } = req.body;

    if (!senderId || !receiverIdentifier || !amount) {
      return res.status(400).json({ message: "Sender, receiver, and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const sender = await User.findById(senderId);
    if (!sender || sender.coins < amount) {
      return res.status(400).json({ message: "Insufficient balance or sender not found" });
    }

    const receiver = await User.findOne({
      $or: [{ username: receiverIdentifier }, { phone: receiverIdentifier }],
    });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    sender.coins -= amount;
    receiver.coins += amount;

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: "Transfer successful", sender, receiver });
  }catch (error) {
    console.error("Transfer error:", error); // Log the full error
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
  
};

