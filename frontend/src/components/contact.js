import React from 'react';
import './Contact.css';  // Import the CSS file for the contact section

const Contact = () => {
  return (
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Reach out to us through the following ways:</p>
      
      <div className="contact-info">
        <p><strong>Phone:</strong> (555) 123-4567</p>
        <p><strong>Email:</strong> info@apizza.com</p>
        <p><strong>Address:</strong> 123 Pizza St., Food City</p>
      </div>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
