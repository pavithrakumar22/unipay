"use client";

import React, { useState } from "react";
import axios from "axios";

const Payment: React.FC = () => {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [message, setMessage] = useState("");

  

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:5001/order", {
        username,
        amount: Number(amount) * 100, // Convert to smallest unit (paise)
        currency,
      });

      setMessage(`Order Created: ${response.data.id}`);
    } catch (error) {
      console.error(error);
      setMessage("Error creating order");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Order</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded-md"
        />

        <input
          type="number"
          placeholder="Amount (INR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-2 p-2 border rounded-md"
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <button
          onClick={handlePayment}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Pay Now
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Payment;
