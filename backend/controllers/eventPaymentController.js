import mongoose from 'mongoose';
import Event from '../models/EventModel.js';
import Purchase from "../models/purchaseModel.js";
import User from "../models/userModel.js";
import Coins from '../models/Coins.js';

const processPayment = async (amount) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, transactionId: 'tx_' + Date.now() }), 1000);
  });
};

export const payForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid eventId format.' });
    }

    const user = await Coins.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const existingPurchase = await Purchase.findOne({ eventId, userId: user._id });
    if (existingPurchase) {
      return res.status(400).json({ success: false, message: 'User has already purchased a pass for this event.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }


    if (user.coins < event.amount) {
      return res.status(400).json({ success: false, message: 'Insufficient coins for this transaction.' });
    }

    const paymentResult = await processPayment(event.amount);
    if (!paymentResult.success) {
      return res.status(400).json({ success: false, message: 'Payment failed. Please try again.' });
    }
    console.log("user coins: "+user.coins);
    console.log("event amount: "+event.amount);

    user.coins -= event.amount;
     await user.save();

    await event.reducePasses();

    const purchase = new Purchase({ eventId, userId: user._id });
    await purchase.save();

    return res.status(200).json({
      success: true,
      message: 'Payment successful, pass purchased.',
      data: { transactionId: paymentResult.transactionId, event: event._id }
    });
  } catch (error) {
    next(error);
  }
};
