import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaList, FaPlus, FaQuestionCircle } from 'react-icons/fa'; // Importing specific icons

const ResidentSwHeader = () => {
  const location = useLocation();

  return (
    <Nav className="flex-column bg-success text-white p-3" style={{ width: '250px', height: '100%' }}>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/" 
        active={location.pathname === "/resident/specialWaste/"}
        className="mb-2 text-white d-flex align-items-center" // Added flex utilities
      >
        <FaList className="me-2" /> {/* List icon */}
        My Requests
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/specialRequest" 
        active={location.pathname === "/resident/specialWaste/specialRequest"}
        className="mb-2 text-white d-flex align-items-center" // Added flex utilities
      >
        <FaPlus className="me-2" /> {/* Plus icon */}
        Add New Request
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/resident/specialWaste/help" 
        active={location.pathname === "/resident/specialWaste/help"}
        className="mb-2 text-white d-flex align-items-center" // Added flex utilities
      >
        <FaQuestionCircle className="me-2" /> {/* Help icon */}
        Help
      </Nav.Link>
    </Nav>
  );
};

export default ResidentSwHeader;
