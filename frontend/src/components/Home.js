import React from "react";  
import "./Home.css"; 
import heroImage from '../images/hero2.png';      
import offerImage from '../images/pepperoni.jpg';  
import buy2 from '../images/buy2.jpg';  
import freedelivery from '../images/freedelivery.png';  

function Home() {  
  return (  
    <div className="Home">  

      <div className="hero">  
        <div className="hero-content">  
          <div className="text-section">  
            <h1>Welcome to APizza</h1>  
            <p>Order your favorite pizza and enjoy a 50% discount on your first purchase!</p>  
            <button>Order Now</button>  
          </div>  
          <div className="image-section">  
            <img src={heroImage} alt="Pizza" />  
          </div>  
        </div>  
      </div>  

      <section id="offers" className="offers-section">  
        <h1>Special Offers</h1>  
        <div className="offer-cards">  
          <div className="offer-card">  
            <img src={offerImage} alt="Offer 1" />  
            <h3>50% Off on Your First Order</h3>  
            <p>Get half off your first pizza when you order now!</p>  
            <button>Claim Offer</button>  
          </div>  
          <div className="offer-card">  
            <img src={freedelivery} alt="Offer 3" />  
            <h3>Free Delivery on Orders Above \$20</h3>  
            <p>Get free delivery for orders above \$20!</p>  
            <button>Claim Offer</button>  
          </div>  
          <div className="offer-card">  
            <img src={buy2} alt="Offer 2" />  
            <h3>Buy 1 Get 1 Free</h3>  
            <p>Order one pizza, get another one for free!</p>  
            <button>Claim Offer</button>  
          </div>  
        </div>  
      </section>  

      <footer>  
        <p>&copy; 2024 APizza. All rights reserved.</p>  
      </footer>  
    </div>  
  );  
}  

export default Home;