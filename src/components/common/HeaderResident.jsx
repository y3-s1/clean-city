import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaQrcode } from 'react-icons/fa'; // Importing Font Awesome icon for QR code

const HeaderResident = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand or Logo */}
        <Navbar.Brand as={Link} to="/">My App</Navbar.Brand>
        
        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/my-waste">My Waste</Nav.Link>
            <Nav.Link as={Link} to="/resident/specialWaste/">Special</Nav.Link>
          </Nav>

          {/* QR Code Icon */}
          <Nav>
            <Nav.Link as={Link} to="/scan-qr">
              <FaQrcode size={24} /> {/* QR code icon */}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderResident;
