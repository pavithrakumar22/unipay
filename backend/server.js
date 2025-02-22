import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import connectDB from "./config/db.js";
import Transaction from "./models/Transaction.js";
import Coins from "./models/Coins.js";
import TransferCoins from "./models/TransferCoins.js";
import Business from "./models/businessModel.js";
import EventModel from "./models/EventModel.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Unipay API is running...");
});

app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/events',eventRoutes);

console.log("🔍 MongoDB Ready State:", mongoose.connection.readyState);


app.post('/order', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const { amount, currency } = req.body;
        const options = {
            amount,
            currency,
            receipt: `receipt#${new Date().getTime()}`
        };

        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating order");
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

app.post('/sample-convert', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const { username, amount, currency } = req.body;
        const options = {
            amount,
            currency,
            receipt: `receipt#${new Date().getTime()}`
        };

        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating order");
        }

        let transaction = await Transaction.findOne({ username });

        if (!transaction) {
            transaction = new Transaction({
                username,
                orders: []
            });
        }

        transaction.orders.push(order);
        await transaction.save();

        const coinValue = amount / 10;
        let userCoins = await Coins.findOne({ username });

        if (!userCoins) {
            userCoins = new Coins({
                username,
                coins: 0
            });
        }

        userCoins.coins += coinValue;
        await userCoins.save();

        res.json({ order, coins: userCoins.coins });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
})

app.get('/transactions/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const transaction = await Transaction.findOne({ username });

        if (!transaction) {
            return res.status(404).json({ message: "No transactions found" });
        }

        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

app.get('/coins/:username', async (req, res) => {
    try {
        const { username } = req.params;
    
        if (!username) {
          return res.status(400).json({ message: "Username is required" });
        }
    
        const userCoins = await Coins.findOne({ username });
    
        if (!userCoins) {
          return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json({ username: userCoins.username, coins: userCoins.coins });
      } catch (error) {
        console.error("Error fetching coins:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }
})


app.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  });

  app.get("/user-transactions/:username", async (req, res) => {
    try {
      const { username } = req.params;
  
      const transactions = await TransferCoins.find({
        $or: [{ sender: username }, { receiver: username }],
      }).sort({ timestamp: -1 }); 
  
      const formattedTransactions = transactions.map((txn) => {
        const isSender = txn.sender === username;
        return {
          id: txn._id,
          username: username,
          amount: isSender ? -txn.transactions.find((t) => t.username === username).amount : txn.transactions.find((t) => t.username === username).amount,
          created_at: txn.timestamp,
          currency: "Coins",
        };
      });
  
      return res.json({ transactions: formattedTransactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/businesses", async (req, res) => {
    try {
      const businesses = await Business.find({});
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/all-events', async (req, res) => {
    try {
      const events = await EventModel.find().sort({ date: 1 });
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  });

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});
