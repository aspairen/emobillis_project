/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const Checkout = ({ orderId, totalAmount, userPhoneNumber }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("");
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/initiate-payment/",
        {
          order_id: orderId,
          phone_number: userPhoneNumber,
          amount: totalAmount,
        }
      );

      if (response.data.success) {
        setPaymentStatus("Payment initiated successfully! Check your phone to complete.");
      } else {
        setError("Payment initiation failed. Please try again.");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total Amount: KES {totalAmount}</p>
      <button onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Proceed to Payment"}
      </button>
      {paymentStatus && <p style={{ color: "green" }}>{paymentStatus}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Checkout;
