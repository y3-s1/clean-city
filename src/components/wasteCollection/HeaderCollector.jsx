import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaQrcode } from 'react-icons/fa'; // Importing Font Awesome icon for QR code
import { NavLink } from 'react-router-dom';

const HeaderCollector = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand or Logo */}
        <Navbar href="#home" className='t-font-bold t-text-green-700 t-text-2xl'>Clean City</Navbar>

        {/* Right-aligned section with QR Code Icon */}
        <div className="d-flex order-lg-2">
          <Nav className="me-auto">
            <NavLink to="/collector/qrScanner" className="nav-link d-flex align-items-center t-mr-5">
              <FaQrcode size={24} /> {/* QR code icon */}
            </NavLink>
          </Nav>
          {/* Toggle button for mobile view (will appear beside the QR code icon on small screens) */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>
        
        {/* Links (collapsible) */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink 
              to="/" 
              className="nav-link" 
              exact // Add exact to match the exact route
              activeClassName="active"
            >
              Home
            </NavLink>
            <NavLink 
              to="/collector/todaySchedule" 
              className="nav-link" 
              activeClassName="active"
            >
              Today Schedule
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderCollector;
