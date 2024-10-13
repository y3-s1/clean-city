import React, { useState } from 'react';

const TodaySchedule = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      address: '123 Main St',
      bins: [
        { id: 'bin1', wastePercentage: 40 },
        { id: 'bin2', wastePercentage: 75 },
      ],
    },
    {
      id: 2,
      address: '456 Elm St',
      bins: [
        { id: 'bin3', wastePercentage: 30 },
        { id: 'bin4', wastePercentage: 90 },
      ],
    },
  ]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

  const handleStart = () => {
    setIsStarted(true);
    // Start session logic
    // In this example, we're just displaying the first card.
    setCurrentDestinationIndex(0);
  };

  const handleNextDestination = () => {
    if (currentDestinationIndex < schedule.length - 1) {
      setCurrentDestinationIndex(currentDestinationIndex + 1);
    }
  };

  const handlePreviousDestination = () => {
    if (currentDestinationIndex > 0) {
      setCurrentDestinationIndex(currentDestinationIndex - 1);
    }
  };

  const totalDestinations = schedule.length;
  const completedDestinations = currentDestinationIndex;
  const remainingDestinations = totalDestinations - completedDestinations;

  return (
    <div className="t-container t-mx-auto t-p-4">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Today's Waste Collection Schedule</h1>

      {/* Session Details */}
      <div className="t-bg-gray-100 t-p-4 t-rounded-lg t-shadow-md t-mb-6">
        <div className="t-flex t-justify-between t-items-center">
          <div>
            <p>Total Destinations: {totalDestinations}</p>
            <p>Completed: {completedDestinations}</p>
            <p>Remaining: {remainingDestinations}</p>
          </div>
          {!isStarted && (
            <button
              onClick={handleStart}
              className="t-px-4 t-py-2 t-bg-blue-500 t-text-white t-rounded-lg t-hover:bg-blue-600"
            >
              Start Session
            </button>
          )}
        </div>
      </div>

      {/* Destination Cards */}
      {isStarted && schedule.length > 0 && (
        <div className="t-destination-cards">
          <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mb-4">
            <h2 className="t-text-xl t-font-semibold">Destination {currentDestinationIndex + 1}</h2>
            <p>Address: {schedule[currentDestinationIndex].address}</p>
            <div className="t-bins-list t-mt-4">
              <h3 className="t-font-semibold">Bins:</h3>
              {schedule[currentDestinationIndex].bins.map((bin) => (
                <div
                  key={bin.id}
                  className="t-flex t-justify-between t-items-center t-p-2 t-bg-gray-100 t-rounded-md t-mt-2"
                >
                  <p>Bin {bin.id}</p>
                  <p>Waste Percentage: {bin.wastePercentage}%</p>
                </div>
              ))}
            </div>
            <div className="t-mt-4">
              <button
                className="t-px-4 t-py-2 t-bg-green-500 t-text-white t-rounded-lg t-hover:bg-green-600"
                onClick={() => console.log('Navigating to', schedule[currentDestinationIndex].address)}
              >
                Navigate
              </button>
            </div>
          </div>

          {/* Navigation between destinations */}
          <div className="t-flex t-justify-between t-mt-4">
            <button
              onClick={handlePreviousDestination}
              disabled={currentDestinationIndex === 0}
              className={`t-px-4 t-py-2 t-rounded-lg ${currentDestinationIndex === 0 ? 't-bg-gray-300' : 't-bg-blue-500 t-text-white t-hover:bg-blue-600'}`}
            >
              Previous Destination
            </button>
            <button
              onClick={handleNextDestination}
              disabled={currentDestinationIndex === schedule.length - 1}
              className={`t-px-4 t-py-2 t-rounded-lg ${currentDestinationIndex === schedule.length - 1 ? 't-bg-gray-300' : 't-bg-blue-500 t-text-white t-hover:bg-blue-600'}`}
            >
              Next Destination
            </button>
          </div>
        </div>
      )}

      {!isStarted && <p className="t-text-gray-500">Start the session to view the destinations.</p>}
    </div>
  );
};

export default TodaySchedule;
