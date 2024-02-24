import React from "react";
import "./FeaturePage.css";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import PersonIcon from "@mui/icons-material/Person";
import SpeedIcon from "@mui/icons-material/Speed";

const FeaturePage = () => {
  return (
    <div className="feature-page text-center">
      <h2 className="display-4 mb-4">Key Features</h2>
      <div className="feature-list row">
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <LockOpenRoundedIcon sx={{ fontSize: 150 }} />
            <h4>
              <b>Secure Verification</b>
            </h4>
            <p>
              Our platform ensures the security and authenticity of certificate
              verification.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <PersonIcon sx={{ fontSize: 150 }} />
            <h4>
              <b>User-friendly Interface</b>
            </h4>
            <p>
              Enjoy a user-friendly interface for a seamless and intuitive
              verification process.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="feature-card">
            <SpeedIcon sx={{ fontSize: 150 }} />
            <h4>
              <b>Fast and Reliable</b>
            </h4>
            <p>
              Experience fast and reliable verification services, ensuring quick
              results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
