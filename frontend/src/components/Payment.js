import React, { useState } from "react";
import axios from "axios";  
import "./Payment.css"

const PaymentCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const paymentData = {
      amount,
      card_number: cardNumber,
      expiry_date: expiryDate,
      cvv,
      phone_number: phoneNumber,
    };

    try {
      
      const response = await axios.post("http://localhost:8000/api/pay/", paymentData);

     
      if (response.data.success) {
        setPaymentStatus("Payment Successful!");
      } else {
        setPaymentStatus("Payment Failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="payment-container">
      <form onSubmit={handleSubmit}>
        <h2>Enter Your Card Details</h2>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            placeholder="Amount in USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            maxLength="16"
            placeholder="1234 5678 9101 1121"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="password"
            maxLength="3"
            placeholder="•••"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="+234 898 2356 789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>

      {paymentStatus && <div>{paymentStatus}</div>}
    </div>
  );
};

export default PaymentCard;