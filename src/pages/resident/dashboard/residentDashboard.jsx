import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../../components/resident/sidebar/sidebar';
import WasteLevelMonitoring from '../../../components/resident/WasteLevelMonitoring';
import requestCollection from '../../resident/requestCollection/requestCollection';
// import './ResidentDashboard.css'; // Optional: Custom styles for the ResidentDashboard

function ResidentDashboard() {
  return (
    <div className="d-flex flex-column flex-md-row"> {/* Flex-column for mobile, row for desktop */}
      {/* Sidebar */}
      {/* <Sidebar /> */}
      
      {/* Main Content Area */}
      <div className="main-content flex-fill p-4">
        <Routes>
          <Route path="/" element={<WasteLevelMonitoring />} />
          <Route path="/request/*" element={<requestCollection />} />
        </Routes>
      </div>
    </div>
  );
}

export default ResidentDashboard;
