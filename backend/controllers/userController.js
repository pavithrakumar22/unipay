import asyncHandler from "express-async-handler";
import { registerUser, loginUser } from "../services/userService.js";
import Coins from "../models/Coins.js";
import Business from "../models/businessModel.js";
import TransferCoins from "../models/TransferCoins.js";

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


import mongoose from "mongoose";

export const transferCoins = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderUsername, receiverUsername, amount } = req.body;

    if (!senderUsername || !receiverUsername || !amount) {
      return res.status(400).json({ message: "Sender, receiver, and amount are required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let sender = await Coins.findOne({ username: senderUsername });
    if (!sender) {
      sender = await Coins.create([{ username: senderUsername, coins: 0 }], { session });
    }

    const receiver = await Coins.findOne({ username: receiverUsername });

    if (!receiver) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Receiver not found" });
    }

    sender = await Coins.findOneAndUpdate(
      { username: senderUsername, coins: { $gte: parsedAmount } },
      { $inc: { coins: -parsedAmount } },
      { new: true, session }
    );

    if (!sender) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await Coins.findOneAndUpdate(
      { username: receiverUsername },
      { $inc: { coins: parsedAmount } },
      { new: true, session }
    );

    const transaction = new TransferCoins({
      sender: senderUsername,
      receiver: receiverUsername,
      transactions: [
        { type: "debited", amount: parsedAmount, username: senderUsername },
        { type: "credited", amount: parsedAmount, username: receiverUsername }
      ],
      timestamp: new Date(),
    });

    await transaction.save({ session });

    await session.commitTransaction();
    return res.status(200).json({ message: "Transfer successful", sender, receiver, transaction });

  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    session.endSession();
  }
};






export const transferToBusiness = async (req, res) => {
  try {
    const { username, businessPhoneNumber, amount } = req.body;

    if (!username) {
      return res.status(401).json({ message: "Unauthorized: No user session found" });
    }

    const sender = await Coins.findOne({ username });
    const receiver = await Business.findOne({ phoneNumber: businessPhoneNumber });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (!receiver) {
      return res.status(404).json({ message: "Business receiver not found" });
    }

    if (sender.coins < amount) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    sender.coins -= amount;
    receiver.coins += amount;

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    console.error("Error transferring to business:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
