import React, { useState } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import './sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Button className="d-md-none" onClick={toggleSidebar}>
        Toggle Sidebar
      </Button>

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <h4 className="sidebar-title">Navigation</h4>
        <Nav className="flex-column">
          <Nav.Link href="my-waste" className="sidebar-link">Waste Level Monitoring</Nav.Link>
          <Nav.Link href="my-waste/request" className="sidebar-link">Collection Requests</Nav.Link>
          <Nav.Link href="#bin-history" className="sidebar-link">Bin Usage History</Nav.Link>
          <Nav.Link href="#settings" className="sidebar-link">Settings</Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
