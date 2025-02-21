import asyncHandler from "express-async-handler";
import { registerUser, loginUser } from "../services/userService.js";
import User from "../models/userModel.js";
import Business from "../models/businessModel.js";


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
    const senderUsername = "testpay"; // Auto-fetched from session/middleware
    const { receiverIdentifier, amount } = req.body; // receiverIdentifier = username or phone
    console.log(senderUsername);
    console.log(receiverIdentifier );
    console.log(amount);

    if (!senderUsername || !receiverIdentifier || !amount) {
      return res.status(400).json({ message: "Sender, receiver, and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const sender = await User.findOne({ username: senderUsername });
    if (!sender || sender.coins < amount) {
      return res.status(400).json({ message: "Insufficient balance or sender not found" });
    }

    const receiver = await User.findOne({
      $or: [{ username: receiverIdentifier }, { phone: receiverIdentifier }],
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver.username === sender.username) {
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    sender.coins -= amount;
    receiver.coins += amount;

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: "Transfer successful", sender, receiver });
  } catch (error) {
    console.error("Transfer error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// export const transferToBusiness = async (req, res) => {
//   try {
//     const senderId = "67b81aadb645979d0bc71e75"; // Auto-fetched from session/middleware
//     const { businessPhoneNumber, amount } = req.body;

//     if (!senderId || !businessPhoneNumber || !amount) {
//       return res.status(400).json({ message: "Sender, business phone number, and amount are required" });
//     }

//     if (amount <= 0) {
//       return res.status(400).json({ message: "Amount must be greater than zero" });
//     }

//     const sender = await User.findById(senderId);
//     if (!sender || sender.coins < amount) {
//       return res.status(400).json({ message: "Insufficient balance or sender not found" });
//     }

//     const business = await Business.findOne({ phoneNumber: businessPhoneNumber });
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }

//     sender.coins -= amount;
//     business.coins += amount;

//     await sender.save();
//     await business.save();

//     return res.status(200).json({ message: "Payment successful", sender, business });
//   } catch (error) {
//     console.error("Transfer to business error:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };


// import User from "../models/userModel.js";
// import Business from "../models/businessModel.js";

// export const transferToBusiness = async (req, res) => {
//   try {
//     const senderUsername = "test"; // Fetched from middleware
//     const { businessPhoneNumber, amount } = req.body;

//     if (!senderUsername || !businessPhoneNumber || !amount) {
//       return res.status(400).json({ message: "Sender, business phone number, and amount are required" });
//     }

//     if (amount <= 0) {
//       return res.status(400).json({ message: "Amount must be greater than zero" });
//     }

//     // Find sender by username
//     const sender = await User.findOne({ username: senderUsername });
//     if (!sender || sender.coins < amount) {
//       return res.status(400).json({ message: "Insufficient balance or sender not found" });
//     }

//     // Find business by phone number
//     const business = await Business.findOne({ phoneNumber: businessPhoneNumber });
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }

//     // Perform transaction
//     sender.coins -= amount;
//     business.coins += amount;

//     await sender.save();
//     await business.save();

//     return res.status(200).json({
//       message: "Payment successful",
//       sender: { username: sender.username, coins: sender.coins },
//       business: { businessName: business.businessName, coins: business.coins },
//     });
//   } catch (error) {
//     console.error("Transfer to business error:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

