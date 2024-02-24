import React, { useState } from "react";
import NavbarCertif from "./components/Navbar";
import Footer from "./components/Footer";
import "./regenerate.css";
function Regenerate() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("error");
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/admin/getuserdetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        // Handle success, maybe show a success message
        console.log("Request successful");
        setAlertMessage(`Email sent successfully.`);
        setAlertSeverity("success");
        setShowAlert(true);
      } else {
        // Handle errors, maybe show an error message
        console.error("Request failed");
        setLoading(false);
        setAlertMessage("Failed to send email, please try again");
        setAlertSeverity("error");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      setAlertMessage("Failed to send email, please try again");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <div className="navLogin">
        <NavbarCertif textColor="#FFFFFF" />
      </div>
      <div className="container cont">
        <div class="image">
          <img src="regen-img.jpg" alt="Image" className="regImg" />
        </div>
        <div class="regenerateDiv">
          <h2>Regenerate</h2>
          <form onSubmit={handleSubmit} className="RegForm">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary RegBtn">
              Send
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Regenerate;
