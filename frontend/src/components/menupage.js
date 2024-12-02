import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menupage.css';

const MenuPage = () => {
    const [pizzaList, setPizzaList] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPizzas();
    }, []);

    const fetchPizzas = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/menu/');
            setPizzaList(response.data);
        } catch (error) {
            console.error('Error fetching pizzas:', error);
            setMessage({ text: 'Error fetching pizza data.', type: 'error' });
        }
    };

    return (
        <div className="menu-container">
            <h1 className="menu-title">Pizza Menu</h1>
            
            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            {pizzaList.length === 0 ? (
                <div className="empty-message">No pizzas available at the moment.</div>
            ) : (
                <div className="pizza-grid">
                    {pizzaList.map((pizza) => (
                        <div className="pizza-cube" key={pizza.id}>
                            <div className="pizza-image">
                                <img src={pizza.image} alt={pizza.name} />
                            </div>
                            <div className="pizza-details">
                                <h2 className="pizza-name">{pizza.name}</h2>
                                <p className="pizza-description">{pizza.description}</p>
                                <p className="pizza-price">
                                    ${typeof pizza.price === 'number' && !isNaN(pizza.price)
                                        ? pizza.price.toFixed(2)
                                        : 'Invalid price'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
