import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomizePizza.css';

const PizzaCustomizer = () => {
  const [toppings, setToppings] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/toppings/')
      .then(response => setToppings(response.data))
      .catch(error => console.error('Error fetching toppings:', error));
  }, []);

  const handleToppingChange = (toppingId) => {
    setToppings(toppings.map(topping => 
      topping.id === toppingId 
        ? { ...topping, selected: !topping.selected }
        : topping
    ));
  };

  const calculateTotal = () => {
    return toppings
      .filter(topping => topping.selected)
      .reduce((sum, topping) => sum + parseFloat(topping.price || 0), 0)
      .toFixed(2);
  };

  const handleAddToCart = () => {
    const selectedToppings = toppings
      .filter(topping => topping.selected)
      .map(topping => ({
        topping_id: topping.id, 
        quantity: 1,
      }));
  
    axios.post('http://127.0.0.1:8000/api/carts/%7Bcart_id%7D/add_to_cart/', selectedToppings)
      .then(response => {
        console.log('Added to cart', response.data);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
  };

  const handleGoToCart = () => {
    navigate('/cart', { state: { cartItems } });
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="main-card">
          <div className="header">
            <h2 className="title">Customize Your Perfect Pizza</h2>
          </div>

          <div className="toppings-grid">
            {toppings.map((topping) => (
              <div 
                key={topping.id} 
                className={`topping-card ${topping.selected ? 'selected' : ''}`}
              >
                <div className="topping-content">
                  <div className="topping-image-container">
                    <img
                      src={`http://127.0.0.1:8000${topping.image}`}
                      alt={topping.name}
                      className="topping-image"
                    />
                  </div>
                  <div className="topping-info">
                    <p className="topping-name">{topping.name}</p>
                    <p className="topping-price">
                      +${(parseFloat(topping.price) || 0).toFixed(2)}
                    </p>
                    <input
                      type="checkbox"
                      id={`topping-${topping.id}`}
                      checked={topping.selected || false}
                      onChange={() => handleToppingChange(topping.id)}
                      className="topping-checkbox"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="footer">
            <div className="total-amount">
              Total Amount: <span className="total-price">${calculateTotal()}</span>
            </div>
            <div className="button-group">
              <button
                onClick={handleAddToCart}
                className="button button-primary"
              >
                Add to Cart
              </button>
              <button
                onClick={handleGoToCart}
                className="button button-secondary"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;