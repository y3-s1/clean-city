import React from 'react';
import { useLocation } from 'react-router-dom';

const FullSessionDetails = () => {
  const location = useLocation();
  const {
    isStarted,
    schedule,
    currentDestinationIndex,
    totalDestinations,
    completedDestinations,
    remainingDestinations,
  } = location.state || {};

  return (
    <div className="t-container t-mx-auto t-p-4 t-bg-gray-300">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Full Session Details</h1>

      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mb-6">
        <h2 className="t-text-xl t-font-semibold">Session Status</h2>
        <p>Session Started: {isStarted ? 'Yes' : 'No'}</p>
        <p>Total Destinations: {totalDestinations}</p>
        <p>Completed Destinations: {completedDestinations}</p>
        <p>Remaining Destinations: {remainingDestinations}</p>
      </div>

      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md">
        <h2 className="t-text-xl t-font-semibold t-mb-4">Destinations List</h2>
        {schedule && schedule.length > 0 ? (
          schedule.map((destination, index) => (
            <div key={destination.id} className="t-mb-4 t-bg-gray-100 t-p-4 t-rounded-md">
              <h3 className="t-text-lg t-font-bold">
                Destination {index + 1} {index === currentDestinationIndex && '(Current)'}
              </h3>
              <p>Address: {destination.address}</p>
              <div className="t-bins-list t-mt-4">
                <h4 className="t-font-semibold">Bins:</h4>
                {destination.bins.map((bin) => (
                  <div
                    key={bin.id}
                    className="t-flex t-justify-between t-items-center t-p-2 t-bg-white t-rounded-md t-shadow-sm t-mt-2"
                  >
                    <p>Bin ID: {bin.id}</p>
                    <p>Waste Level: {bin.currentWasteLevel}%</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="t-text-gray-500">No destinations available.</p>
        )}
      </div>
    </div>
  );
};

export default FullSessionDetails;
