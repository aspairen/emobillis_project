/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const MPesaPayment = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/mpesa/stkpush/", {
        phone_number: phone,
        amount: amount,
      });
      setMessage("Payment initiated! Check your phone.");
    } catch (error) {
      setMessage("Payment failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>MPesa Payment</h2>
      <form onSubmit={handlePayment}>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="2547XXXXXXXX"
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MPesaPayment;
