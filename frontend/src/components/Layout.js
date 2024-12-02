import React from "react";  
import { Link } from "react-router-dom";  
import './Layout.css';  

const Layout = ({ children }) => {  
  return (  
    <div className="layout">  
      <header>  
        <nav>  
          <ul>  
            <li><Link to="/">Home</Link></li>  
            <li><Link to="/menu">Menu</Link></li>  
            <li><Link to="#about">About</Link></li>  
            <li><Link to="#contact">Contact</Link></li>  
            <li><Link to="/customize">Customize Pizza</Link></li>  
            <li><Link to="/payment">Payment</Link></li>
            <li><Link to="/profile">Profile</Link></li>  
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>  

          </ul>  
        </nav>  
      </header>  
      <main>{children}</main>  
      <footer>  
        <p>&copy; 2024 APizza. All rights reserved.</p>  
      </footer>  
    </div>  
  );  
}  

export default Layout;