import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Payment.css';
import delivery_img from "../images/delivery.png"
import dinein_img from '../images/dine-in.png'
import pickup_img from  '../images/pick-up.png'
import visa_img from '../images/visa.png'
import cash_img from '../images/cash.png'
const Payment = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [serviceType, setServiceType] = useState('Dine In');
  const [cardDetails, setCardDetails] = useState({
    card_number: '',
    expiry_date: '',
    cvv: ''
  });

  useEffect(() => {
    fetchCartItems();
    fetchTotalPrice();
  }, []);

  const fetchCartItems = () => {
    const token = localStorage.getItem('access_token');
    setIsLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/carts/get_cart_items/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartItems(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        setIsLoading(false);
      });
  };

  const fetchTotalPrice = () => {
    const token = localStorage.getItem('access_token');
    axios
      .get('http://127.0.0.1:8000/api/carts/get_total_price/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTotalPrice(response.data.total_price))
      .catch((error) => console.error('Error fetching total price:', error));
  };

  const handlePayment = () => {
    const token = localStorage.getItem('access_token');
    const payload = {
      service_type: serviceType,
      payment_method: paymentMethod,
      amount: totalPrice,
    };

    if (paymentMethod === 'Visa') {
      payload.card_number = cardDetails.card_number;
      payload.expiry_date = cardDetails.expiry_date;
      payload.cvv = cardDetails.cvv;
    }

    axios
      .post('http://127.0.0.1:8000/api/payments/process_payment/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert(`Payment ${response.data.payment_status}!`);
      })
      .catch((error) => {
        console.error('Error processing payment:', error);
        alert('Payment failed. Please try again.');
      });
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="payment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your payment details...</p>
        </div>
      </div>
    );
  }

  const serviceTypeImages = {
    'Dine In': dinein_img,
    'Pick Up': pickup_img,
    'Delivery': delivery_img,
  };

  const paymentMethodImages = {
    Cash: cash_img,
    Visa: visa_img,
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Order</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <p>Add some items before proceeding to payment.</p>
        </div>
      ) : (
        <div className="payment-layout">
          <div className="order-summary-section">
            <h3>Order Summary</h3>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <span className="item-name">
                      {item.pizza
                        ? `${item.quantity} × ${item.pizza.name}`
                        : `${item.quantity} × ${item.topping.name}`}
                    </span>
                    <span className="item-price">
                      ${parseFloat(item.total_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-section">
              <span>Total Amount</span>
              <span className="total-price">${parseFloat(totalPrice).toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-details-section">
            <div className="service-type-selector">
              <h3>Select Service Type</h3>
              <div className="service-options">
                {['Dine In', 'Pick Up', 'Delivery'].map((type) => (
                  <button
                    key={type}
                    className={`service-option ${serviceType === type ? 'selected' : ''}`}
                    onClick={() => setServiceType(type)}
                  >
                    <div className="option-icon">
                      <img src={serviceTypeImages[type]} alt={type} />
                    </div>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="payment-method-selector">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                {['Cash', 'Visa'].map((method) => (
                  <button
                    key={method}
                    className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <div className="option-icon">
                      <img src={paymentMethodImages[method]} alt={method} />
                    </div>
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'Visa' && (
              <div className="card-details-form">
                <h3>Card Details</h3>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="card_number"
                    value={cardDetails.card_number}
                    onChange={handleCardDetailsChange}
                    maxLength="16"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry_date"
                      value={cardDetails.expiry_date}
                      onChange={handleCardDetailsChange}
                      maxLength="5"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardDetailsChange}
                      maxLength="3"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            <button className="submit-payment-button" onClick={handlePayment}>
              Pay ${parseFloat(totalPrice).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
