import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import profileImage from "../images/download.png";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    profileImage: profileImage,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation for all fields
  const validateField = (id, value) => {
    switch (id) {
      case "phoneNumber":
        const phoneRegex = /^\+20[0-9]{10}$/;
        if (!value) return "Phone number is required";
        if (!value.startsWith("+20")) return "Phone number must start with +20";
        if (!phoneRegex.test(value)) return "Please enter a valid Egyptian phone number";
        break;
      case "firstName":
      case "lastName":
        if (!value) return `${id === "firstName" ? "First" : "Last"} name is required`;
        break;
      default:
        break;
    }
    return "";
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setUserData((prev) => ({
          ...prev,
          displayName: data.username,
          email: data.email,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));

    // Validate the field dynamically
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, value),
    }));
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));

    // Validate the field on blur
    setErrors((prev) => ({
      ...prev,
      [id]: validateField(id, userData[id]),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    for (const field in userData) {
      const error = validateField(field, userData[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);

    // If there are errors, do not submit
    if (Object.values(newErrors).some((error) => error)) {
      setTouched((prev) =>
        Object.keys(userData).reduce((acc, key) => ({ ...acc, [key]: true }), prev)
      );
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccessMessage("Profile updated successfully!");
      console.log("Updated Profile:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  // Render error or success message
  if (error) return <div className="error">{error}</div>;

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
              onBlur={handleBlur}
              placeholder="Enter your first name"
              className={touched.firstName && errors.firstName ? "error" : ""}
              required
            />
            {touched.firstName && errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={userData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your last name"
              className={touched.lastName && errors.lastName ? "error" : ""}
              required
            />
            {touched.lastName && errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input type="text" id="displayName" value={userData.displayName} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" value={userData.email} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+20"
            className={touched.phoneNumber && errors.phoneNumber ? "error" : ""}
            required
          />
          {touched.phoneNumber && errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        <button type="submit">Save Changes</button>
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default ProfilePage;
