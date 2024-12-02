import React, { useState } from 'react';

const PizzaCustomizer = () => {
  const [toppings, setToppings] = useState([
    { id: 1, name: 'Tomato Sauce', price: 0.00, selected: false },
    { id: 2, name: 'Cheese', price: 0.50, selected: false },
    { id: 3, name: 'Pepperoni', price: 1.00, selected: false },
    { id: 4, name: 'Mushrooms', price: 0.75, selected: false },
    { id: 5, name: 'Bell Peppers', price: 0.50, selected: false },
    { id: 6, name: 'Olives', price: 0.50, selected: false },
    { id: 7, name: 'Onions', price: 0.40, selected: false },
    { id: 8, name: 'Bacon', price: 1.50, selected: false },
  ]);

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
      .reduce((sum, topping) => sum + topping.price, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg mt-8">
          <div className="p-6">
            <h2 className="text-2xl text-center text-orange-600 mb-6">
              Customize Your Pizza
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toppings.map((topping) => (
                <div
                  key={topping.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id={`topping-${topping.id}`}
                      checked={topping.selected}
                      onChange={() => handleToppingChange(topping.id)}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <label
                      htmlFor={`topping-${topping.id}`}
                      className="text-gray-700 cursor-pointer"
                    >
                      {topping.name}
                    </label>
                  </div>
                  <span className="text-gray-600">
                    ${topping.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t">
              <div className="text-right text-xl font-semibold mb-4">
                Total Price: ${calculateTotal()}
              </div>
              <button
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                onClick={() => alert('Order placed!')}
              >
                Order Pizza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;