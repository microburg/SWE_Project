import React, { useState } from 'react';  
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';  
import Menu from './components/menupage';  
import Cart from './components/Cart';  
import AdminOrders from './components/AdminOrders';  
import Home from './components/Home';  
import CustomizePizza from './components/CustomizePizza';  
import Layout from './components/Layout';  
import './components/App.css';   
import AdminPage from './components/AdminPage';  
import Login from './components/Login'; 
import ProfilePage from './components/ProfilePage';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import PaymentCard from './components/Payment';
import Contact from './components/contact';
function App() {  
  const [accessToken, setAccessToken] = useState('');  
  const [error, setError] = useState('');  

  return (  
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">  
      <Router>  
        <ConditionalLayout>  
          <Routes>  
            <Route path="/" element={<Home />} />  
            <Route path="/cart" element={< Cart />} />  
            <Route path="/admin-orders" element={<AdminOrders />} />  
            <Route path="/menu" element={<Menu />} />  
            <Route path="/customize" element={<CustomizePizza />} />  
            <Route path="/admin" element={<AdminPage />} />  
            <Route path="/login" element={<Login setAccessToken={setAccessToken} setError={setError} />} />  
            <Route path="/profile" element={<ProfilePage />} />  
            <Route path="/payment" element={<PaymentCard />} /> 
            <Route path="/contact" element={<Contact/>} /> 
          </Routes>  
        </ConditionalLayout>  
      </Router>  
    </GoogleOAuthProvider>  
  );  
}  

const ConditionalLayout = ({ children }) => {  
  const location = useLocation();  

  // Define the routes you want to exclude from the layout  
  const pathsWithoutLayout = ['/login', '/admin'];  

  // Check if the current path is one of the excluded paths  
  const shouldRenderWithoutLayout = pathsWithoutLayout.includes(location.pathname);  

  return (  
    shouldRenderWithoutLayout ?   
      <>{children}</> :   
      <Layout>  
        <Navigation /> {/* Include the Navigation component */}  
        {children}  
      </Layout>  
  );  
};  

// Navigation component  
const Navigation = () => {  
  
};  

const navButtonStyle = {  
  margin: '0 10px',  
  padding: '10px 20px',  
  color: '#fff',  
  background: '#FF5C00',  
  border: 'none',  
  borderRadius: '5px',  
  cursor: 'pointer'  
};  

export default App;