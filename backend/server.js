import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import Transaction from "./models/Transaction.js";
import Coins from "./models/Coins.js";

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Unipay API is running...");
});

app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);

// ✅ Debug MongoDB Connection
console.log("🔍 MongoDB Ready State:", mongoose.connection.readyState);  // 0: Disconnected, 1: Connected, 2: Connecting, 3: Disconnecting

// ✅ Create an Order

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

        // ✅ Save Order in Transactions Collection
        // let transaction = await Transaction.findOne({ username });

        // if (!transaction) {
        //     transaction = new Transaction({
        //         username,
        //         orders: []
        //     });
        // }

        // transaction.orders.push(order);
        // await transaction.save();

        // // ✅ Update Coins Collection
        // const coinValue = amount / 10;
        // let userCoins = await Coins.findOne({ username });

        // if (!userCoins) {
        //     userCoins = new Coins({
        //         username,
        //         coins: 0
        //     });
        // }

        // userCoins.coins += coinValue;
        // await userCoins.save();

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

// ✅ Fetch User Transactions
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


// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});
