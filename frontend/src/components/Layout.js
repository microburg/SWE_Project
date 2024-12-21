import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Layout.css';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="layout">
      <header>
        <nav className="nav-container">
          <div className="nav" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/menu" onClick={toggleMenu}>Menu</Link></li>
            <li><Link to="#about" onClick={toggleMenu}>About</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
            <li><Link to="/customize" onClick={toggleMenu}>Customize Pizza</Link></li>
            <li><Link to="/payment" onClick={toggleMenu}>Payment</Link></li>
            <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
            <li><Link to="/cart" onClick={toggleMenu}>Cart</Link></li>
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 APizza. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;