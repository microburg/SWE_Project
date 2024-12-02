import React, { useState, useEffect } from 'react';
import Message from './Message';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
    const [pizzaID, setPizzaID] = useState('');
    const [pizzaName, setPizzaName] = useState('');
    const [pizzaDescription, setPizzaDescription] = useState('');
    const [pizzaPrice, setPizzaPrice] = useState('');
    const [updatePizzaID, setUpdatePizzaID] = useState('');
    const [newPizzaPrice, setNewPizzaPrice] = useState('');
    const [message, setMessage] = useState(null);
    const [pizzaList, setPizzaList] = useState([]);

    useEffect(() => {
        fetchPizzas();
    }, []);

    const fetchPizzas = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/menu/');
            console.log('Fetched pizzas:', response.data);
            setPizzaList(response.data);
        } catch (error) {
            console.error('Error fetching pizzas:', error);
            setMessage({ text: 'Error fetching pizzas.', type: 'error' });
        }
    };

    const handleAddPizzaSubmit = async (e) => {
        e.preventDefault();

        if (!pizzaID || !pizzaName || !pizzaDescription || !pizzaPrice || isNaN(parseFloat(pizzaPrice))) {
            setMessage({ text: 'Please fill in all fields correctly.', type: 'error' });
            return;
        }

        const newPizza = {
            id: pizzaID,
            name: pizzaName,
            description: pizzaDescription,
            price: parseFloat(pizzaPrice),
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/menu/', newPizza);
            console.log('Response:', response.data);
            setPizzaList([...pizzaList, response.data]);
            setMessage({ text: 'Pizza added successfully!', type: 'success' });
        } catch (error) {
            console.error('Error adding pizza:', error);
            setMessage({ text: 'Error adding pizza.', type: 'error' });
        }
    };

    const handleUpdatePriceSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/menu/${updatePizzaID}/`, { price: parseFloat(newPizzaPrice) });
            const updatedPizza = response.data;
    
            // Update pizza list with the updated pizza
            const updatedList = pizzaList.map((pizza) =>
                pizza.id === updatedPizza.id ? updatedPizza : pizza
            );
    
            setPizzaList(updatedList);
            setMessage({ text: 'Pizza price updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error updating pizza price:', error);
            setMessage({ text: 'Pizza ID not found or error while updating!', type: 'error' });
        }
    
        setUpdatePizzaID('');
        setNewPizzaPrice('');
    };

    return (
        <div className="container">
            <h1>Pizza Admin Panel</h1>

            <div className="form-container">
                <h2>Add a New Pizza</h2>
                <form onSubmit={handleAddPizzaSubmit}>
                    <label>Pizza ID:</label>
                    <input
                        type="text"
                        value={pizzaID}
                        onChange={(e) => setPizzaID(e.target.value)}
                        required
                    />
                    <label>Pizza Name:</label>
                    <input
                        type="text"
                        value={pizzaName}
                        onChange={(e) => setPizzaName(e.target.value)}
                        required
                    />
                    <label>Description:</label>
                    <textarea
                        value={pizzaDescription}
                        onChange={(e) => setPizzaDescription(e.target.value)}
                        required
                    ></textarea>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={pizzaPrice}
                        onChange={(e) => setPizzaPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />
                    <button type="submit">Add Pizza</button>
                </form>
            </div>

            <div className="form-container">
                <h2>Update Pizza Price</h2>
                <form onSubmit={handleUpdatePriceSubmit}>
                    <label>Pizza ID:</label>
                    <input
                        type="text"
                        value={updatePizzaID}
                        onChange={(e) => setUpdatePizzaID(e.target.value)}
                        required
                    />
                    <label>New Price:</label>
                    <input
                        type="number"
                        value={newPizzaPrice}
                        onChange={(e) => setNewPizzaPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />
                    <button type="submit">Update Price</button>
                </form>
            </div>

            <div className="pizza-list">
                <h2>Pizza List</h2>
                {pizzaList.length === 0 ? (
                    <p>No pizzas added yet.</p>
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
                                        {typeof pizza.price === "number" && !isNaN(pizza.price) ?
                                            pizza.price.toFixed(2) :
                                            "Invalid price"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {message && <Message text={message.text} type={message.type} />}
        </div>
    );
};

export default AdminPage;
