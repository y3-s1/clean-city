import React from 'react'
import { useNavigate } from 'react-router-dom';

const HomeCollector = () => {
  const navigate = useNavigate();

  // Handlers for different navigation options
  const handleStartSchedule = () => {
    navigate('/collector/todaySchedule');
  };

  const handleViewFullSession = () => {
    navigate('/collector/todaySchedule');
  };

  const handlePastCollections = () => {
    navigate('/collector/todaySchedule');
  };

  const handleMapView = () => {
    navigate('/collector/todaySchedule');
  };

  const handleSettings = () => {
    navigate('/collector/todaySchedule');
  };

  return (
    <div className="t-container t-mx-auto t-p-6 t-bg-gray-100 t-min-h-screen">
      <h1 className="t-text-3xl t-font-bold t-mb-8 t-text-center">Waste Collector Dashboard</h1>

      {/* Start Daily Schedule */}
      <div className="t-bg-white t-p-6 t-rounded-lg t-shadow-md t-mb-8">
        <h2 className="t-text-2xl t-font-semibold t-mb-4">Daily Schedule</h2>
        <p className="t-text-gray-600 t-mb-4">Begin your waste collection route for today.</p>
        <button
          className="t-px-6 t-py-3 t-bg-green-600 t-text-white t-rounded-lg t-hover:bg-green-700"
          onClick={handleStartSchedule}
        >
          Start Schedule
        </button>
      </div>

      {/* View Session Details */}
      <div className="t-bg-white t-p-6 t-rounded-lg t-shadow-md t-mb-8">
        <h2 className="t-text-2xl t-font-semibold t-mb-4">View Full Session</h2>
        <p className="t-text-gray-600 t-mb-4">Check the details of your current waste collection session.</p>
        <button
          className="t-px-6 t-py-3 t-bg-blue-600 t-text-white t-rounded-lg t-hover:bg-blue-700"
          onClick={handleViewFullSession}
        >
          View Session Details
        </button>
      </div>

    </div>
  );
};

export default HomeCollector