import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function AdminNavbar({ textColor }) {
  const headStyle = {
    zIndex: 10,
    backgroundColor: "#4e54c8",
  };
  return (
    <Navbar expand="lg" data-bs-theme="light" style={headStyle}>
      <Container>
        <Navbar.Brand
          style={{ color: textColor }}
          href="/"
          className="text-uppercase"
        >
          Verifier
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
