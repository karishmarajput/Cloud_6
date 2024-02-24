import React from "react";
import "./MainPage.css";
import { Container, Row, Col } from "react-bootstrap";
import { TypeAnimation } from "react-type-animation";
import Button from "react-bootstrap/Button";

const MainPage = () => {
  return (
    <div className="main-page container">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <img className="art-bc" src="art-bc.png" />
      <img className="art-spiral" src="art-spiral.png" />
      <img className="art-shield" src="art-shield.png" />
      <Container style={{ zIndex: 10 }}>
        <Row className="d-flex align-items-center justify-content-center">
          <Col md={8} lg={12} className="text-center">
            <h1 className="display-4 font-weight-bold mb-4 header-text">
              WAKE. GENERATE.
              <br />
              VERIFY. REPEAT.
            </h1>
            <p className="lead">
              Empowering Trust Through Seamless Certificate <br />
              Verification and Generation.
            </p>

            <a href="/verify" variant="primary" className="btn mainBtn">
              Verify
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
