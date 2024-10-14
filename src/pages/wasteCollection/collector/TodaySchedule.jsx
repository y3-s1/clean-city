import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

const TodaySchedule = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [assignedTruckId, setAssignedTruckId] = useState("Deilkd4ZzF4cKBDUOU9e");
  const [fetchedSchedule, setFetchedSchedule] = useState([]);
  const [fetchedRequests, setFetchedRequests] = useState([]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      address: '123 Main St',
      bins: [
        { id: 'bin1', currentWasteLevel: 40 },
        { id: 'bin2', currentWasteLevel: 75 },
      ],
    },
    {
      id: 2,
      address: '456 Elm St',
      bins: [
        { id: 'bin3', currentWasteLevel: 30 },
        { id: 'bin4', currentWasteLevel: 90 },
      ],
    },
  ]);

  useEffect(() => {
    console.log("Updated fetchedSchedule: ", fetchedRequests);
  }, [fetchedRequests]);
  



  const handleStart = () => {
    setIsStarted(true);
    setCurrentDestinationIndex(0);
  };

  const handleNavigateFullSessionDetails = () => {
    navigate('/collector/fullSessionDetails', {
      state: {
        isStarted,
        schedule,
        currentDestinationIndex,
        totalDestinations: schedule.length,
        completedDestinations: currentDestinationIndex,
        remainingDestinations: schedule.length - currentDestinationIndex,
      },
    });
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

  // Helper function to get today's date without time (setting time to 00:00:00)
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00)
    return today;
  };

  // Helper function to get only the date part from a Firestore Timestamp
  const getDatePartFromTimestamp = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    date.setHours(0, 0, 0, 0); // Set the time part to 00:00:00 to compare only the date
    return date;
  };

  // Fetch today's schedules for the assigned truck
  const fetchTodaySchedules = async () => {
    try {
      const scheduledCollectionRef = collection(db, 'ScheduledCollections');
      const q = query(
        scheduledCollectionRef,
        where('truckId', '==', assignedTruckId)
      );

      const querySnapshot = await getDocs(q);
      const schedules = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(schedule => {
          const scheduleDate = getDatePartFromTimestamp(schedule.scheduledTime);
          const today = getTodayDate();
          return scheduleDate.getTime() === today.getTime();
        });

      setFetchedSchedule(schedules);
      setLoading(false);

      // Fetch waste collection requests based on the request IDs from the first schedule
      if (schedules.length > 0) {
        const requestIds = schedules[0].requestIds;
        await fetchWasteCollectionRequests(requestIds);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules');
      setLoading(false);
    }
  };


  // Fetch waste collection requests based on request IDs
  const fetchWasteCollectionRequests = async (requestIds) => {
    try {
      const requestsCollectionRef = collection(db, 'WasteCollectionRequests');
      const q = query(
        requestsCollectionRef,
        where('__name__', 'in', requestIds) // Using '__name__' to query by document ID.
      );

      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFetchedRequests(requests);
      console.log('Fetched requests:', requests);
    } catch (err) {
      console.error('Error fetching waste collection requests:', err);
      setError('Failed to fetch waste collection requests');
    }
  };


  useEffect(() => {
    fetchTodaySchedules();
  }, [assignedTruckId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalDestinations = schedule.length;
  const completedDestinations = currentDestinationIndex;
  const remainingDestinations = totalDestinations - completedDestinations;


  

  return (
    <div className="t-container t-mx-auto t-p-4 t-bg-gray-300">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Today's Waste Collection Schedule</h1>

      {/* Session Details */}
      <div className="t-bg-gray-100 t-p-4 t-rounded-lg t-shadow-md t-mb-6">
        <div className="t-flex t-justify-between t-items-center">
          <div>
            <p>Total Destinations: {totalDestinations}</p>
            <p>Completed: {completedDestinations}</p>
            <p>Remaining: {remainingDestinations}</p>
          </div>
          <div className="t-flex t-flex-col t-items-end t-mb-1 t-mt-auto">
            <div>
              {!isStarted && (
                <button
                  onClick={handleStart}
                  className="t-px-4 t-py-2 t-bg-green-600 t-text-white t-rounded-lg t-hover:bg-blue-600"
                >
                  Start Session
                </button>
              )}
            </div>
            <div className="t-mt-2">
              <a
                className="t-text-black t-text-xs t-hover:underline"
                onClick={handleNavigateFullSessionDetails}
              >
                View Session Details
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Cards */}
      {isStarted && schedule.length > 0 && (
        <div className="t-destination-cards">
          <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mb-4">
            <h2 className="t-text-xl t-font-semibold">Destination {currentDestinationIndex + 1}</h2>
            <p>Route: {schedule[currentDestinationIndex].route}</p>
            <div className="t-bins-list t-mt-4">
              <h3 className="t-font-semibold">Request IDs:</h3>
              {schedule[currentDestinationIndex].requestIds.map((requestId, index) => (
                <div key={index} className="t-py-1">
                  {requestId}
                </div>
              ))}
            </div>
            <div className="t-mt-4">
              <button
                className="t-px-4 t-py-2 t-bg-green-500 t-text-white t-rounded-lg t-hover:bg-green-600"
                onClick={() => console.log('Navigating to', schedule[currentDestinationIndex].route)}
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
              className={`t-px-4 t-py-2 t-rounded-lg ${
                currentDestinationIndex === 0 ? 't-bg-gray-300' : 't-bg-blue-500 t-text-white t-hover:bg-blue-600'
              }`}
            >
              Previous Destination
            </button>
            <button
              onClick={handleNextDestination}
              disabled={currentDestinationIndex === schedule.length - 1}
              className={`t-px-4 t-py-2 t-rounded-lg ${
                currentDestinationIndex === schedule.length - 1 ? 't-bg-gray-300' : 't-bg-blue-500 t-text-white t-hover:bg-blue-600'
              }`}
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
