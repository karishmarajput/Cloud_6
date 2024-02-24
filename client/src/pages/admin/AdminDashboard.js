import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AdminNavbar from "../components/AdminNavbar";
import CountUp from "react-countup";
import "./AdminDashboard.css";
import Table from "react-bootstrap/Table";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [organisations, setOrganisations] = useState([]);
  const [orgCount,setOrgCount] = useState()
  const [templateCount,setTemplateCount] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrganisations();
    handleCount();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      const response = await fetch("http://localhost:8000/admin/home", {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data);
      setOrganisations(data.data);
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      const response = await fetch(
        `http://localhost:8000/admin/verifyUser/${id}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      fetchOrganisations();
    } catch (error) {
      console.error("Error verifying organisation:", error);
    }
  };

  const handleListAll = () => {
    navigate("/list-all-organisation");
  };

  const handleCount = () => {
    fetch("http://localhost:8000/admin/analytics")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        const { orgCount, templateCount } = data;
        setOrgCount(orgCount)
        setTemplateCount(templateCount)
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const UserCount = ({ maxValue, text }) => {
    return (
      <div className="counter-div">
        <h2 className="count-head">
          <CountUp start={0} end={maxValue} duration={5} />
        </h2>
        <p className="count-sub">{text}</p>
      </div>
    );
  };

  return (
    <div>
      <AdminNavbar textColor="#fff" />
      <Container fluid className="dashboard">
        <Row className="admin-dash">
          <Col xl={6} lg={12}>
            <h1>
              <b>Hello Admin !</b>
            </h1>
            <h5>
              Welcome to the Admin Dashboard! Gain insights with responsive
              graphs and real-time data. Get list of all organisation present.
              Explore the features for streamlined and informed decision-making.
            </h5>
            <button className="admin-btn" onClick={handleListAll}>
              List all Organisations
            </button>
          </Col>
          <Col xl={6} lg={12}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <UserCount
                // onClick={handleCount}
                maxValue={orgCount}
                text={"Number of Organizations"}
              />
              <UserCount
                maxValue={templateCount}
                text={"Number of certificates"}
              />
            </div>
          </Col>
        </Row>
        <Table hover className="verify-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(organisations) && organisations.length > 0 ? (
              organisations.map((org) => (
                <tr key={org._id}>
                  <td>{org.name}</td>
                  <td>{org.phoneNumber}</td>
                  <td>{org.email}</td>
                  <td>
                    <button
                      onClick={() => handleVerify(org._id)}
                      className="verify-btn"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No organisations found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
