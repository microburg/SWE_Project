import React, { useState, useEffect } from 'react';
import './menupage.css';

const MenuPage = () => {
  const [pizzaList, setPizzaList] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/menu/');
      const data = await response.json();
      setPizzaList(data);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
      setMessage({ text: 'Error fetching pizza data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (pizzaId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [pizzaId]: true
    }));
  };

  const addToCart = async (pizzaId) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setMessage({ text: 'Please login to add items to cart', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/carts/add_to_cart/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pizza_id: pizzaId, quantity: 1 }),
      });
      
      if (!response.ok) throw new Error('Failed to add to cart');
      
      setMessage({ text: 'Added to cart successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ 
        text: 'Error adding item to cart', 
        type: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <h1 className="menu-title">Our Pizza Selection</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {pizzaList.length === 0 ? (
        <div className="empty-message">
          <p>No pizzas available at the moment.</p>
          <p>Please check back later!</p>
        </div>
      ) : (
        <div className="pizza-grid">
          {pizzaList.map((pizza) => {
            const price = Number(pizza.price);
            const priceString = isNaN(price) ? 'Price unavailable' : `$${price.toFixed(2)}`;
            const imageUrl = pizza.image?.startsWith('http') 
              ? pizza.image 
              : `http://127.0.0.1:8000${pizza.image}`;

            return (
              <div className="pizza-card" key={pizza.id}>
                <div className="pizza-image-container">
                  {!imageLoadErrors[pizza.id] ? (
                    <img
                      className="pizza-image"
                      src={imageUrl}
                      alt={pizza.name}
                      onError={() => handleImageError(pizza.id)}
                    />
                  ) : (
                    <div className="pizza-image-placeholder">
                      <span>Image not available</span>
                    </div>
                  )}
                </div>
                <div className="pizza-content">
                  <h2 className="pizza-name">{pizza.name}</h2>
                  <p className="pizza-description">{pizza.description}</p>
                  <div className="pizza-footer">
                    <span className="pizza-price">{priceString}</span>
                    <button 
                      className="add-to-cart-button"
                      onClick={() => addToCart(pizza.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuPage;