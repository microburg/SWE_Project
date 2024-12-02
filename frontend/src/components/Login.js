import React, { useState } from 'react';  
import axios from 'axios';  
import { GoogleLogin } from '@react-oauth/google';  
import { useNavigate } from 'react-router-dom'; 
import './Login.css';


const Login = ({ setAccessToken, setError }) => {  
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');  
  const [email, setEmail] = useState('');  
  const [isSignup, setIsSignup] = useState(false);  
  const [errorMessage, setErrorMessage] = useState(''); 
  
  const navigate = useNavigate(); // Initialize navigate  

  const handleUsernameChange = (e) => setUsername(e.target.value);  
  const handlePasswordChange = (e) => setPassword(e.target.value);  
  const handleEmailChange = (e) => setEmail(e.target.value);  

  const handleLogin = async (e) => {  
    e.preventDefault();  
    setErrorMessage(''); // Reset the error message  

    try {  
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {  
        username,  
        password,  
      });  
      setAccessToken(response.data.access);  
      localStorage.setItem('access_token', response.data.access);  
      alert('Login successful');  
      navigate('/'); // Redirect to home page after successful login  
    } catch (error) {  
      console.error('Login Failed:', error.response?.data || error.message);  
      setErrorMessage('Login failed: Invalid credentials'); // Set error message  
    }  
  };  

  const handleSignup = async (e) => {  
    e.preventDefault();  
    setErrorMessage(''); // Reset error message  

    try {  
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', {  
        username,  
        email,  
        password,  
      });  
      alert('Signup successful');  
      setIsSignup(false);  
      navigate('/'); // Redirect to home page after successful signup  
    } catch (error) {  
      console.error('Signup Failed:', error.response?.data || error.message);  
      setErrorMessage('Signup failed: ' + (error.response?.data.error || 'Please try again.'));  
    }  
  };  

  const handleGoogleLoginSuccess = async (response) => {  
    console.log('Google login success:', response);  
    try {  
      const googleToken = response.credential;  
      const responseData = await axios.post('http://127.0.0.1:8000/api/google/', {  
        token: googleToken,  
      });  
      setAccessToken(responseData.data.access);  
      localStorage.setItem('access_token', responseData.data.access);  
      alert('Google login successful');  
      navigate('/'); // Redirect to home page after successful Google login  
    } catch (error) {  
      console.error('Google Login Failed:', error.response?.data || error.message);  
      setErrorMessage('Google login failed');  
    }  
  }; 

  const handleGoogleLoginFailure = (error) => {  
    console.log('Google login error:', error);  
    setErrorMessage('Google login failed');  
  };  

  const toggleForm = () => {  
    setIsSignup(!isSignup);  
    setErrorMessage(''); // Reset error when toggling forms  
  };  

  return (  
    <div className="login-box">  
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>  

      {errorMessage && <p className="error-message">{errorMessage}</p>}  

      {!isSignup && (  
        <form onSubmit={handleLogin}>  
          <div className="input-group">  
            <label>Username:</label>  
            <input  
              type="text"  
              value={username}  
              onChange={handleUsernameChange}  
              required  
              placeholder="Enter your username"  
            />  
          </div>  
          <div className="input-group">  
            <label>Password:</label>  
            <input  
              type="password"  
              value={password}  
              onChange={handlePasswordChange}  
              required  
              placeholder="Enter your password"  
            />  
          </div>  
          <button type="submit" className="login-btn">Login</button>  
        </form>  
      )}  

      {isSignup && (  
        <form onSubmit={handleSignup}>  
          <div className="input-group">  
            <label>Username:</label>  
            <input  
              type="text"  
              value={username}  
              onChange={handleUsernameChange}  
              required  
              placeholder="Choose a username"  
            />  
          </div>  
          <div className="input-group">  
            <label>Email:</label>  
            <input  
              type="email"  
              value={email}  
              onChange={handleEmailChange}  
              required  
              placeholder="Enter your email"  
            />  
          </div>  
          <div className="input-group">  
            <label>Password:</label>  
            <input  
              type="password"  
              value={password}  
              onChange={handlePasswordChange}  
              required  
              placeholder="Choose a password"  
            />  
          </div>  
          <button type="submit" className="signup-btn">Sign Up</button>  
        </form>  
      )}  

      <button onClick={toggleForm} className="toggle-btn">  
        {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}  
      </button>  

      <GoogleLogin  
        onSuccess={handleGoogleLoginSuccess}  
        onError={handleGoogleLoginFailure}  
      />  
    </div>  
  );  
};  

export default Login;