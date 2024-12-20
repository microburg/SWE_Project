import React, { useEffect, useState, useRef } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle the profile picture URL
        let profileImageUrl = "";
        if (data.profilePicture) {
          // If the backend returns a relative URL, prepend the base URL
          profileImageUrl = data.profilePicture.startsWith('http') 
            ? data.profilePicture 
            : `http://127.0.0.1:8000${data.profilePicture}`;
        }

        setUserData((prev) => ({
          ...prev,
          displayName: data.username,
          email: data.email,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
          profileImage: profileImageUrl, // Only set the profile image if available
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, userData[id]) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        profileImage: previewUrl, // Set the preview image
        profilePictureFile: file, // Store the actual file for submission
      }));

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("phoneNumber", userData.phoneNumber);

    if (userData.profilePictureFile) {
      formData.append("profilePicture", userData.profilePictureFile);
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send form data as multipart/form-data
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();

      setSuccessMessage("Profile updated successfully!");
      console.log("Updated Profile:", data);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="profile-picture-container" onClick={handlePictureClick}>
        <div className="profile-picture">
          <img src={userData.profileImage || ""} alt="Profile" />
          <div className="edit-overlay">
            <span>Edit Picture</span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }} // Hide the file input
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {isLoading && <div className="loading">Loading...</div>}
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

        <button type="submit" disabled={isLoading}>Save Changes</button>
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default ProfilePage;
