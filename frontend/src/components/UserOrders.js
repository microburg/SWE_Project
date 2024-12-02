import React, { useState, useEffect } from 'react';  
import axios from 'axios';  

const UserOrders = ({ accessToken }) => {  
  const [userOrders, setUserOrders] = useState([]);  

  const fetchUserOrders = async () => {  
    const response = await axios.get('http://127.0.0.1:8000/api/orders/', {  
      headers: { Authorization: `Token ${accessToken}` },  
    });  
    setUserOrders(response.data);  
  };  

  useEffect(() => {  
    if (accessToken) {  
      fetchUserOrders();  
    }  
  }, [accessToken]);  

  // Function to delete an order  
  const handleDelete = async (orderId) => {  
    await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}/`, {  
      headers: { Authorization: `Token ${accessToken}` },  
    });  
    fetchUserOrders(); // Refresh orders after deletion  
  };  

  return (  
    <div>  
      <h1>Your Cart</h1>  
      <table>  
        <thead>  
          <tr>  
            <th>Order ID</th>  
            <th>Items</th>  
            <th>Total Amount</th>  
            <th>Actions</th>  
          </tr>  
        </thead>  
        <tbody>  
          {userOrders.length === 0 ? (  
            <tr>  
              <td colSpan="4">No items in your cart.</td>  
            </tr>  
          ) : (  
            userOrders.map(order => (  
              <tr key={order.id}>  
                <td>{order.id}</td>  
                <td>{order.items}</td>  
                <td>${order.total_amount}</td>  
                <td>  
                  <button onClick={() => handleDelete(order.id)}>Delete</button>  
                </td>  
              </tr>  
            ))  
          )}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default UserOrders;