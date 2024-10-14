import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const ResidentSwHeader = () => {
  const location = useLocation();

  return (
    <Nav className="flex-column bg-success text-white p-3" style={{ width: '250px', height: '100%' }}>
      <h3 className="mb-4">Special Waste Management</h3>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/" 
        active={location.pathname === "/resident/specialWaste/"}
        className="mb-2 text-white"
      >
        Requests
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/specialRequest" 
        active={location.pathname === "/resident/specialWaste/specialRequest"}
        className="mb-2 text-white"
      >
        Add New
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/help" 
        active={location.pathname === "/resident/specialWaste/help"}
        className="mb-2 text-white"
      >
        Help
      </Nav.Link>
    </Nav>
  );
};

export default ResidentSwHeader;