import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
        setCartItems(response.data || []); // Default to empty array if null/undefined
        setIsLoading(false);
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        setErrorMessage('Failed to load cart items. Please try again.');
        setIsLoading(false);
      });
  };

  const fetchTotalPrice = () => {
    const token = localStorage.getItem('access_token');
    axios
      .get('http://127.0.0.1:8000/api/carts/get_total_price/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTotalPrice(parseFloat(response.data?.total_price || 0).toFixed(2)); // Handle null total_price
      })
      .catch((error) => {
        console.error('Error fetching total price:', error);
        setErrorMessage('Failed to load total price. Please try again.');
      });
  };

  const handleAddToCart = (item, type) => {
    const token = localStorage.getItem('access_token');
    const endpoint = `http://127.0.0.1:8000/api/carts/add_to_cart/`;
    const payload = {
      quantity: item?.quantity || 1, // Default to 1 if quantity is null
      ...(type === 'pizza' ? { pizza_id: item?.id } : { topping_id: item?.id }),
    };

    axios
      .post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchCartItems();
        fetchTotalPrice();
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error);
        setErrorMessage('Failed to add item to cart. Please try again.');
      });
  };

  const handleRemoveFromCart = (item) => {
    const token = localStorage.getItem('access_token');
    const endpoint = `http://127.0.0.1:8000/api/carts/remove_from_cart/`;
    const payload = item?.pizza
      ? { pizza_id: item?.pizza?.id }
      : { topping_id: item?.topping?.id };

    axios
      .post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchCartItems();
        fetchTotalPrice();
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
        setErrorMessage('Failed to remove item from cart. Please try again.');
      });
  };

  const handleCheckout = () => {
    if (cartItems?.length === 0) {
      alert('Your cart is empty! Add some items before proceeding to checkout.');
      return;
    }
    alert('Proceeding to checkout!');
  };

  if (isLoading) {
    return (
      <div className="cart-container">
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {cartItems?.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <p>Add some delicious items to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems?.map((item) => (
              <div key={item?.id || Math.random()} className="cart-item">
                <div className="cart-item-details">
                  <span className="item-name">
                    {item?.pizza
                      ? `${item?.quantity || 0} x ${item?.pizza?.name || 'Unknown Pizza'}`
                      : item?.topping
                      ? `${item?.quantity || 0} x ${item?.topping?.name || 'Unknown Topping'}`
                      : `${item?.quantity || 0} x Item details not available`}
                  </span>
                  <span className="item-price">
                    ${parseFloat(item?.total_price || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${parseFloat(totalPrice || 0).toFixed(2)}</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
