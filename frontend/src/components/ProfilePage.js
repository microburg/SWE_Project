import React, { useEffect, useState } from "react";
import './ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the token from local storage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/basic-info/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="container">
    //   <h1>Profile Information</h1>
    //   <div className="form-container">
    //     <h2>Personal Details</h2>
    //     <label>Name:</label>
    //     <input type="text" value={userData.username} readOnly />

    //     <label>Email:</label>
    //     <input type="email" value={userData.email} readOnly />
    //   </div>
    // </div>
    


      <div class="account-overview">  
        <h2>Account Overview</h2>  

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first-name">First Name *</label>
            <input type="text" id="first-name" placeholder="Enter your first name" />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last Name *</label>
            <input type="text" id="last-name" placeholder="Enter your last name" />
          </div>
        </div>


        <div class="form-group">  
            <label>Username</label>  
            <input type="text" value={userData.username} readOnly placeholder="Username" />  
        </div>  

        <div class="form-group">  
            <label>Email:</label>  
            <input type="email" value={userData.email} readOnly placeholder="Email address" />  
        </div>  

        <div class="form-group">  
            <label for="current-password">Current Password (leave blank to leave unchanged)</label>  
            <input type="password" id="current-password" placeholder="Current password" />  
        </div>  

        <div class="form-group">  
            <label for="new-password">New Password (leave blank to leave unchanged)</label>  
            <input type="password" id="new-password" placeholder="New password" />  
        </div>  

        <div class="form-group">  
            <label for="confirm-password">Confirm New Password</label>  
            <input type="password" id="confirm-password" placeholder="Confirm new password" />  
        </div>  

        <button type="submit" class="btn-save">Save Changes</button>  
    </div>
  );
};

export default ProfilePage;
