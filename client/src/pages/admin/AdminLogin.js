import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import NavbarCertif from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from '../components/Loader';
import CustomAlert from '../components/Alert';
function AdminLogin() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };
  const handleemailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        localStorage.setItem('authToken', authToken);
        navigate('/admin-dashboard');
      } else {
        // alert('Invalid email or password');
        console.log('error')
        setAlertMessage('Invalid email or password');
        setAlertSeverity('error')
        setShowAlert(true);
      }
      setemail('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <> 
    <div className="navLoginAdmin">
        <NavbarCertif  textColor="#FFFFFF" />
    </div>
    <CustomAlert
        open={showAlert}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      {loading && <Loader />}
    <div className="login-container">
      <div className="flex-container-login">
        <div className="image-section-login">
          <img src="admin-login-side.jpg" alt="yo" />
        </div>
        <div className="form-section-login">
          <h2>Admin Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label htmlFor="ogNumber">Email:</label>
              <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={handleemailChange}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="password">Password:</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group-login-button">
              <button type="submit">Login</button>
            </div>
          </form>
          </div>
        </div>
      </div>
      <Footer />
      </>
  );
}

export default AdminLogin;
