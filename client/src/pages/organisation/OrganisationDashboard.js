import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../components/AdminNavbar";
import './OrgDash.css';
import { Container, Row, Col } from "react-bootstrap";
import Footer from "../components/Footer";

function OrganisationDashboard(){
  const navigate = useNavigate();
    const handleGenerateCertificate = () => {
        
      navigate('/generate-certificate');
      };
    const handleShowAllTemplate=()=>{
      navigate('/show-templates');
    }
    return(
      <>
      <div className="navLogin">
        <AdminNavbar  textColor="#FFFFFF" />
      </div>
      <div className='x' >
        <div className="org-dash">
          <div className="org-image">
            <img src="org-dash.png" alt="org dashboard" />
          </div>
          <div>
            <h1>
              <b>Hello Organisation !</b>
            </h1>
            <h5>
              Welcome to the Organisation Dashboard! Generate certificate and mail it to the individuals.
            </h5>
          </div>
        </div>
        
          <Row className="org-button">
            <Col xs lg="2"><button onClick={handleGenerateCertificate}>Generate Certificate</button></Col>
            <Col xs lg="2"><button onClick={handleShowAllTemplate}>Show all Templates</button></Col>
        </Row>
        </div>

        <Footer/>
      </>
      
    )
}
export default OrganisationDashboard