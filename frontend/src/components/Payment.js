import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import delivery_img from "../images/delivery.png"
import dinein_img from '../images/dine-in.png'
import pickup_img from '../images/pick-up.png'
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
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({
    card_number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const navigate = useNavigate(); 

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
        if (error.response && error.response.status === 401) {
          alert('You need to log in first.');
          navigate('/login');
        } else {
          console.error('Error fetching cart items:', error);
        }
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
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('You need to log in first.');
          navigate('/login');
        } else {
          console.error('Error fetching total price:', error);
        }
      });
  };

  const validateCardNumber = (value) => {
    if (!/^\d+$/.test(value)) {
      return 'Card number must contain only numbers';
    }
    if (value.length !== 16) {
      return 'Card number must be 16 digits';
    }
    return '';
  };

  const validateExpiryMonth = (value) => {
    if (!/^\d+$/.test(value)) {
      return 'Month must contain only numbers';
    }
    const month = parseInt(value);
    if (month < 1 || month > 12) {
      return 'Month must be between 01 and 12';
    }
    return '';
  };

  const validateExpiryYear = (value) => {
    if (!/^\d+$/.test(value)) {
      return 'Year must contain only numbers';
    }
    const year = parseInt(value);
    const currentYear = new Date().getFullYear() % 100;
    if (year < currentYear) {
      return 'Card has expired';
    }
    return '';
  };

  const validateCVV = (value) => {
    if (!/^\d+$/.test(value)) {
      return 'CVV must contain only numbers';
    }
    if (value.length !== 3) {
      return 'CVV must be 3 digits';
    }
    return '';
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'card_number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiryMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (name === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    let error = '';
    switch (name) {
      case 'card_number':
        error = validateCardNumber(formattedValue);
        break;
      case 'expiryMonth':
        error = validateExpiryMonth(formattedValue);
        break;
      case 'expiryYear':
        error = validateExpiryYear(formattedValue);
        break;
      case 'cvv':
        error = validateCVV(formattedValue);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handlePayment = () => {
    const token = localStorage.getItem('access_token');
    
    // Validate all fields before submission
    if (paymentMethod === 'Visa') {
      const cardNumberError = validateCardNumber(cardDetails.card_number);
      const monthError = validateExpiryMonth(cardDetails.expiryMonth);
      const yearError = validateExpiryYear(cardDetails.expiryYear);
      const cvvError = validateCVV(cardDetails.cvv);

      setErrors({
        card_number: cardNumberError,
        expiryMonth: monthError,
        expiryYear: yearError,
        cvv: cvvError
      });

      if (cardNumberError || monthError || yearError || cvvError) {
        alert('Please correct the errors before submitting');
        return;
      }
    }

    const payload = {
      service_type: serviceType,
      payment_method: paymentMethod,
      amount: totalPrice,
    };
  
    if (paymentMethod === 'Visa') {
      payload.card_number = cardDetails.card_number;
      payload.expiry_date = `${cardDetails.expiryMonth}/${cardDetails.expiryYear}`;
      payload.cvv = cardDetails.cvv;
    }
  
    axios
    .post('http://127.0.0.1:8000/api/payments/process_payment/', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      alert(`Payment ${response.data.payment_status}!`);
      navigate('/');
    })
    .catch((error) => {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    });
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
                    placeholder="Card Number"
                  />
                  {errors.card_number && (
                    <span className="error-message">{errors.card_number}</span>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <div className="expiry-date-inputs">
                      <input
                        type="text"
                        name="expiryMonth"
                        value={cardDetails.expiryMonth}
                        onChange={handleCardDetailsChange}
                        placeholder="MM"
                        className="expiry-input"
                      />
                      <span className="expiry-separator">/</span>
                      <input
                        type="text"
                        name="expiryYear"
                        value={cardDetails.expiryYear}
                        onChange={handleCardDetailsChange}
                        placeholder="YY"
                        className="expiry-input"
                      />
                    </div>
                    {(errors.expiryMonth || errors.expiryYear) && (
                      <span className="error-message">
                        {errors.expiryMonth || errors.expiryYear}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardDetailsChange}
                      placeholder="CVV"
                    />
                    {errors.cvv && (
                      <span className="error-message">{errors.cvv}</span>
                    )}
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
