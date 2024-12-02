import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PizzaCustomizer = () => {
  const [toppings, setToppings] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Cart state to store selected toppings
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

  // Add the selected toppings to the cart
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
        // Update UI, like showing a cart preview
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
  };

  // Navigate to the cart page or another page where the user can proceed to checkout
  const handleGoToCart = () => {
    navigate('/cart', { state: { cartItems } }); // Pass the cartItems to the cart page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-center text-orange-600 mb-6">
          Customize Your Pizza
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {toppings.map((topping) => (
            <div key={topping.id} className="topping-card p-2 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id={`topping-${topping.id}`}
                  checked={topping.selected || false}
                  onChange={() => handleToppingChange(topping.id)}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor={`topping-${topping.id}`}
                  className="text-gray-700 text-sm font-medium cursor-pointer"
                >
                  {topping.name}
                </label>
                <span className="text-gray-600 text-xs">
                  ${(parseFloat(topping.price) || 0).toFixed(2)}
                </span>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={`http://127.0.0.1:8000${topping.image}`} 
                    alt={topping.name}
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t">
          <div className="text-right text-xl font-semibold mb-4">
            Total Price: ${calculateTotal()}
          </div>
          <div className="flex gap-4">
            <button
              className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              onClick={handleGoToCart}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;