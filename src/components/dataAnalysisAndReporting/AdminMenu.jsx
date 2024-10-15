/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function AdminMenu() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [staffDropdownVisible, setStaffDropdownVisible] = useState(false); // State for dropdown visibility

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleToggleStaffDropdown = () => {
    setStaffDropdownVisible(!staffDropdownVisible); // Toggle dropdown visibility
  };

  return (
    <div className="crm-wrapper">
      {/* Top Navbar */}
      <nav className="navbar crm-top-navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggleSidebar} // Toggle sidebar on click
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#">
          <img
            src={''}
            alt="Logo"
            height="50"
            width={130}
          />
        </a>
      </nav>

      <div className={`d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
        {/* Sidebar */}
        <nav className={`crm-sidebar bg-light ${sidebarVisible ? 'active' : ''}`}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink
                to="/admin"
                className="nav-link crm-sidebar-link"
                activeClassName="active"
                end // This ensures the active class is only applied to the exact /admin route
              >
                Dashboard
              </NavLink>
            </li>
            {/* Staff Management with Dropdown */}
            <li className="nav-item">
              <a
                href="#"
                className="nav-link crm-sidebar-link"
                onClick={handleToggleStaffDropdown} // Toggle dropdown on click
              >
                Staff Management
              </a>
              {staffDropdownVisible && (
                <ul className="nav flex-column ml-3"> {/* Indented submenu */}
                  <li className="nav-item">
                    <NavLink
                      to="/admin/addStaff"
                      className="nav-link crm-sidebar-link"
                      activeClassName="active"
                    >
                      Add Staff
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/viewStaff"
                      className="nav-link crm-sidebar-link"
                      activeClassName="active"
                    >
                      View All Staff
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/scheduleCollecting"
                className="nav-link crm-sidebar-link"
                activeClassName="active"
              >
                Schedule Waste Collection
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/allRoutes"
                className="nav-link crm-sidebar-link"
                activeClassName="active"
              >
                Scheduled Routes
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Main content area */}
      </div>
    </div>
  );
}

export default AdminMenu;
