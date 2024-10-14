import React from 'react';
import { useLocation } from 'react-router-dom';

const FullSessionDetails = () => {
  const location = useLocation();
  const {
    schedule, // fetchedSchedule from TodaySchedule component
    currentDestinationIndex,
    totalDestinations,
  } = location.state || {};

  return (
    <div className="t-container t-mx-auto t-p-4 t-bg-gray-300">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Full Session Details</h1>

      {/* Session Status */}
      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mb-6">
        <h2 className="t-text-xl t-font-semibold">Session Status</h2>
        <p>Session Started: {schedule.status === 'Started' ? 'Yes' : 'No'}</p>
        <p>Total Destinations: {totalDestinations}</p>
      </div>

      {/* Destinations List */}
      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md">
        <h2 className="t-text-xl t-font-semibold t-mb-4">Destinations List</h2>
        {schedule && schedule.requestIds && schedule.requestIds.length > 0 ? (
          schedule.requestIds.map((requestId, index) => (
            <div
              key={requestId}
              className="t-mb-4 t-bg-gray-100 t-p-4 t-rounded-md"
            >
              <h3 className="t-text-lg t-font-bold">
                Destination {index + 1} {index === currentDestinationIndex && '(Current)'}
              </h3>
              <p>Request ID: {requestId}</p>

              {/* Assuming fetchedRequests contain bin details for each request */}
              {schedule.bins && schedule.bins.length > 0 && (
                <div className="t-bins-list t-mt-4">
                  <h4 className="t-font-semibold">Bins:</h4>
                  {schedule.bins.map((bin) => (
                    <div
                      key={bin.id}
                      className="t-flex t-justify-between t-items-center t-p-2 t-bg-white t-rounded-md t-shadow-sm t-mt-2"
                    >
                      <p>Bin ID: {bin.id}</p>
                      <p>Waste Level: {bin.currentWasteLevel}%</p>
                    </div>
                  ))}
                </div>
              )}
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
