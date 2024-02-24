import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./WorkingPage.css";

const WorkingPage = () => {
  return (
    <section className="working-page">
      <Container>
        <h2 className="text-center display-4 mb-4">How It Works</h2>
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 text-center">
            {" "}
            {/* Added text-center class */}
            <div className="working-image-container">
              <img
                src="working-1.png"
                alt="Working Image 1"
                className="img-fluid rounded working-image"
              />
            </div>
            <p className="mt-3 working-text">Generation Process</p>
          </Col>
          <Col md={6} className="mb-4 text-center">
            <div className="working-image-container">
              <img
                src="working-2.png"
                alt="Working Image 2"
                className="img-fluid rounded working-image"
              />
            </div>
            <p className="mt-3 working-text">Verification Process</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WorkingPage;
