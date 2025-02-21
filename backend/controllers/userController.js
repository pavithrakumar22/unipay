import asyncHandler from "express-async-handler";
import { registerUser, loginUser } from "../services/userService.js";
import User from "../models/userModel.js";
import Coins from "../models/Coins.js";


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



// export const transferCoins = async (req, res) => {
//   try {
//     const { senderUsername, receiverIdentifier, amount } = req.body;

//     if (!senderUsername || !receiverIdentifier || !amount) {
//       return res.status(400).json({ message: "Sender, receiver, and amount are required" });
//     }

//     const parsedAmount = parseFloat(amount);
//     if (isNaN(parsedAmount) || parsedAmount <= 0) {
//       return res.status(400).json({ message: "Invalid amount" });
//     }

//     const sender = await User.findOneAndUpdate(
//       { username: senderUsername, coins: { $gte: parsedAmount } },
//       { $inc: { coins: -parsedAmount } },
//       { new: true }
//     );

//     if (!sender) {
//       return res.status(400).json({ message: "Insufficient balance or sender not found" });
//     }

//     const receiver = await User.findOneAndUpdate(
//       { $or: [{ username: receiverIdentifier }, { phone: receiverIdentifier }] },
//       { $inc: { coins: parsedAmount } },
//       { new: true }
//     );

//     if (!receiver) {
//       return res.status(404).json({ message: "Receiver not found" });
//     }

//     return res.status(200).json({ message: "Transfer successful", sender, receiver });
//   } catch (error) {
//     console.error("Transfer error:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

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

    // Check sender balance & deduct coins
    const sender = await Coins.findOneAndUpdate(
      { username: senderUsername, coins: { $gte: parsedAmount } },
      { $inc: { coins: -parsedAmount } },
      { new: true, session }
    );

    if (!sender) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance or sender not found" });
    }

    // Add coins to receiver
    const receiver = await Coins.findOneAndUpdate(
      { username: receiverUsername },
      { $inc: { coins: parsedAmount } },
      { new: true, session }
    );

    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver not found" });
    }

    await session.commitTransaction();
    return res.status(200).json({ message: "Transfer successful", sender, receiver });

  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    session.endSession();
  }
};
