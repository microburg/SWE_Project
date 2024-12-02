import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PizzaCustomizer = () => {
  const [toppings, setToppings] = useState([]);
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

  const handleOrder = () => {
    const selectedToppings = toppings
      .filter(topping => topping.selected)
      .map(topping => ({ id: topping.id, name: topping.name, price: topping.price }));

    const totalPrice = calculateTotal();

    axios.post('http://127.0.0.1:8000/api/orders/', {
      toppings: selectedToppings,
      total_price: totalPrice,
    })
      .then(response => {
        navigate(`/payment/${response.data.id}`);
      })
      .catch(error => {
        console.error('Error creating order:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-center text-orange-600 mb-6">
          Customize Your Pizza
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {toppings.map((topping) => (
            <div key={topping.id} className="topping-card">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`topping-${topping.id}`}
                  checked={topping.selected || false}
                  onChange={() => handleToppingChange(topping.id)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor={`topping-${topping.id}`}
                  className="text-gray-700 font-medium cursor-pointer flex-grow"
                >
                  {topping.name}
                </label>
                <span className="text-gray-600">
                  ${(parseFloat(topping.price) || 0).toFixed(2)}
                </span>
              </div>
              <div className="mt-2 h-16 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src={`http://127.0.0.1:8000${topping.image}`} 
                  alt={topping.name}
                  className="h-12 w-12 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t">
          <div className="text-right text-xl font-semibold mb-4">
            Total Price: ${calculateTotal()}
          </div>
          <button
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            onClick={handleOrder}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;