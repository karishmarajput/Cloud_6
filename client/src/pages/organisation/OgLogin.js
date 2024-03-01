import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrganisationDashboard from "./OrganisationDashboard";
import "./OgLogin.css";
import NavbarCertif from "../components/Navbar";
import Footer from "../components/Footer";
import CustomAlert from "../components/Alert";

function OgLogin() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("error");
  const [alertMessage, setAlertMessage] = React.useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
  }, []);

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/organization/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // If login is successful, redirect or render the organisation dashboard
        console.log("Login successful!");
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        navigate("/organisation-dashboard");
      } else {
        // Handle incorrect login details
        console.error("Login failed");
        setAlertMessage("Login failed. Please check your credentials.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset the form after handling the login data
    setemail("");
    setPassword("");
  };
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  return (
    <>
      <div className="navLogin">
        <NavbarCertif textColor="#FFFFFF" />
      </div>
      <CustomAlert
        open={showAlert}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <div className="login-container">
        <div className="bubbleBody">
          <div className="bubble bubble_one"></div>
          <div className="bubble bubble_two"></div>
          <div className="bubble bubble_three"></div>
          <div className="bubble bubble_four"></div>
        </div>
        <div className="flex-container-login">
          <div className="image-section-login">
            <img src="login-side.png" alt="yo" />
          </div>
          <div className="form-section-login">
            <h2 className="header-org">Login Form</h2>
            <form className="login-form-org" onSubmit={handleSubmit}>
              <div className="form-group-login">
                <label htmlFor="email">Organisation Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
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

export default OgLogin;
