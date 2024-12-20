import React, { useEffect, useState } from "react";
import './ProfilePage.css';
import profileImage from '../images/download.png';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    profileImage: profileImage
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+20[0-9]{10}$/;
    if (!phone) return "Phone number is required";
    if (!phone.startsWith('+20')) return "Phone number must start with +20";
    if (!phoneRegex.test(phone)) return "Please enter a valid Egyptian phone number";
    return "";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
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
        setUserData(prev => ({
          ...prev,
          displayName: data.username,
          email: data.email
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: value
    }));

    if (id === 'phoneNumber') {
      const phoneError = validatePhoneNumber(value);
      setErrors(prev => ({
        ...prev,
        phoneNumber: phoneError
      }));
    }
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));

    if (id === 'phoneNumber') {
      const phoneError = validatePhoneNumber(userData.phoneNumber);
      setErrors(prev => ({
        ...prev,
        phoneNumber: phoneError
      }));
    }
  };

// ----------------------------------------------------

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('phone_number', userData.phoneNumber);
    if (userData.profileImageFile) {
        formData.append('profile_image', userData.profileImageFile);
    }

    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/user/update-profile/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Profile updated successfully');
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};

//--------------------------------------------------------

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="profile-picture-container">
        <div className="profile-picture">
          <img src={profileImage} alt="Profile" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={userData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={userData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display name *</label>
          <input
            type="text"
            id="displayName"
            value={userData.displayName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address *</label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone number *</label>
          <input
            type="tel"
            id="phoneNumber"
            value={userData.phoneNumber}
            onChange={(e) => {
              // Allow only numbers and the plus sign
              const value = e.target.value;
              if (/^[\d+]*$/.test(value)) { 
                handleChange(e);
              }
            }}
            onBlur={handleBlur}
            placeholder="+20"
            className={touched.phoneNumber && errors.phoneNumber ? 'error' : ''}
            required
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <div className="error-message">{errors.phoneNumber}</div>
          )}
        </div>


        <button type="submit">Save changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;