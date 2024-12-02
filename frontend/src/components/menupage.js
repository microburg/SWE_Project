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
        <div className="container">
            <h1>Pizza Menu</h1>

            {pizzaList.length === 0 ? (
                <p>No pizzas available at the moment.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pizzaList.map((pizza) => (
                            <tr key={pizza.id}>
                                <td>{pizza.id}</td>
                                <td>{pizza.name}</td>
                                <td>{pizza.description}</td>
                                <td>
                                    {/* Handle price display: if it's invalid, show 'Invalid price' */}
                                    {typeof pizza.price === 'number' && !isNaN(pizza.price)
                                        ? pizza.price.toFixed(2)
                                        : 'Invalid price'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>
    );
};

export default MenuPage;