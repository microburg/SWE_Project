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
    <div className="container">
      <h1>Profile Information</h1>
      <div className="form-container">
        <h2>Personal Details</h2>
        <label>Name:</label>
        <input type="text" value={userData.username} readOnly />

        <label>Email:</label>
        <input type="email" value={userData.email} readOnly />
      </div>
    </div>
  );
};

export default ProfilePage;
