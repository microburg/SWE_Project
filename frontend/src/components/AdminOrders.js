import React, { useState, useEffect } from 'react';  
import axios from 'axios';  

const AdminOrders = () => {  
  const [orders, setOrders] = useState([]);  

  const fetchOrders = async () => {  
    const response = await axios.get('http://127.0.0.1:8000/api/orders/');  
    setOrders(response.data);  
  };  

  useEffect(() => {  
    fetchOrders();  
  }, []);  

  return (  
    <div>  
      <h1>Current Orders</h1>  
      <table>  
        <thead>  
          <tr>  
            <th>Order ID</th>  
            <th>Username</th>  
            <th>Items</th>  
            <th>Total Amount</th>  
          </tr>  
        </thead>  
        <tbody>  
          {orders.map(order => (  
            <tr key={order.id}>  
              <td>{order.id}</td>  
              <td>{order.username}</td>  
              <td>{order.items}</td>  
              <td>${order.total_amount}</td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default AdminOrders;