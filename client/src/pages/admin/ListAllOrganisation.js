import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Table from "react-bootstrap/Table";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import "./ListAllOrganisation.css";

function ListAllOrganisation() {
  const [verifiedOrganisations, setVerifiedOrganisations] = useState([]);

  useEffect(() => {
    fetchVerifiedOrganisations(); // Fetch verified organisations on component mount
  }, []);

  const fetchVerifiedOrganisations = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      const response = await fetch("http://localhost:8000/admin/organisation", {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setVerifiedOrganisations(data.data);
    } catch (error) {
      console.error("Error fetching verified organisations:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };
      const response = await fetch(
        `http://localhost:8000/admin/deleteOrganization/${id}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't Delete");
      }

      fetchVerifiedOrganisations();
    } catch (error) {
      console.error("Error deleting organisation:", error);
    }
  };

  return (
    <div>
      <AdminNavbar textColor="#fff" />
      <Container fluid className="org-list">
        <h2 className="text-center heading">List of Verified Organisations</h2>
        <Table responsive="md" hover className="org-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Delete Organisation</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(verifiedOrganisations) &&
            verifiedOrganisations.length > 0 ? (
              verifiedOrganisations.map((org) => (
                <tr key={org._id}>
                  <td>{org.name}</td>
                  <td>{org.phoneNumber}</td>
                  <td>{org.email}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(org._id)}
                      className="verify-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No verified organisations found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </div>
  );
}

export default ListAllOrganisation;
