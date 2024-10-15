import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { FaTrash } from 'react-icons/fa6';

const TodaySchedule = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [assignedTruckId, setAssignedTruckId] = useState("Deilkd4ZzF4cKBDUOU9e");
  const [fetchedSchedule, setFetchedSchedule] = useState([]);
  const [fetchedRequests, setFetchedRequests] = useState([]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Updated fetchedSchedule: ", fetchedSchedule);
  }, [fetchedSchedule]);

  useEffect(() => {
    console.log("Updated fetchedRequests: ", fetchedRequests);
  }, [fetchedRequests]);

  const handleStart = async () => {
    if (fetchedSchedule.length > 0) {
      const scheduleId = fetchedSchedule[0].id; // Get the first schedule's ID
      
      // Reference the document in Firestore
      const scheduleDocRef = doc(db, 'ScheduledCollections', scheduleId);

      try {
        // Update the document's status field
        await updateDoc(scheduleDocRef, {
          status: 'Started',
        });

        console.log('Schedule status updated to "Started"');
        fetchTodaySchedules();
        setCurrentDestinationIndex(0);
      } catch (error) {
        console.error('Error updating schedule status:', error);
      }
    } else {
      console.error('No schedule found to update.');
    }
  };

  const handleNavigateFullSessionDetails = () => {
    navigate('/collector/fullSessionDetails', {
      state: {
        schedule: fetchedSchedule[0],
        currentDestinationIndex,
        totalDestinations: fetchedRequests.length,
      },
    });
  };

  const handleNextDestination = () => {
    if (currentDestinationIndex < fetchedRequests.length - 1) {
      setCurrentDestinationIndex(currentDestinationIndex + 1);
    }
  };

  const handlePreviousDestination = () => {
    if (currentDestinationIndex > 0) {
      setCurrentDestinationIndex(currentDestinationIndex - 1);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getDatePartFromTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Fetch bins for each request
  const fetchBinsForRequest = async (binIds) => {
    try {
      if (!binIds || binIds.length === 0) {
        console.error('No bin IDs available for fetching.');
        return [];
      }
  
      const binsCollectionRef = collection(db, 'Bins');
      const q = query(binsCollectionRef, where('__name__', 'in', binIds));
  
      const querySnapshot = await getDocs(q);
      const bins = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("bins" ,bins);
      return bins;
    } catch (err) {
      console.error('Error fetching bins:', err.message);
      return [];
    }
  };
  

  const fetchWasteCollectionRequests = async (requestIds) => {
    try {
      if (!requestIds || requestIds.length === 0) {
        console.error('No request IDs available for fetching.');
        return;
      }
  
      const requestsCollectionRef = collection(db, 'WasteCollectionRequests');
      const q = query(requestsCollectionRef, where('__name__', 'in', requestIds));
  
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error('No matching documents found for the provided request IDs.');
        return;
      }
  
      const requestsWithBins = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const requestData = doc.data();
          const bins = await fetchBinsForRequest(requestData.binID); // Fetch the bin details for each request
          return {
            id: doc.id,
            ...requestData,
            bins, // Add bins to each request object
          };
        })
      );
  
      setFetchedRequests(requestsWithBins);
      console.log('Fetched requests with bins:', requestsWithBins);
    } catch (err) {
      console.error('Error fetching waste collection requests:', err.message);
      setError('Failed to fetch waste collection requests');
    }
  };
  

  const fetchTodaySchedules = async () => {
    try {
      const scheduledCollectionRef = collection(db, 'ScheduledCollections');
      const q = query(scheduledCollectionRef, where('truckId', '==', assignedTruckId));

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


  useEffect(() => {
    fetchTodaySchedules();
  }, [assignedTruckId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalDestinations = fetchedRequests.length;

  return (
    <div className="t-container t-mx-auto t-p-4 t-bg-gray-300">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Today's Waste Collection Schedule</h1>

      <div className="t-bg-gray-100 t-p-4 t-rounded-lg t-shadow-md t-mb-6">
        <div className="t-flex t-justify-between t-items-center">
          <div>
            {/* <span className='t-font-semibold'>{fetchedSchedule[0]?.route}</span> */}
            <p>Total Destinations: {totalDestinations}</p>
          </div>
          <div className="t-flex t-flex-col t-items-end t-mb-1 t-mt-auto">
            <div>
              {fetchedSchedule[0]?.status !== 'Started' && (
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

      {fetchedSchedule[0]?.status === 'Started' && fetchedRequests.length > 0 && (
        <div className="t-destination-cards">
          <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mb-4">
            <h2 className="t-text-xl t-font-semibold">Destination {currentDestinationIndex + 1}</h2>
            {/* <p>Route: {fetchedSchedule[0].route}</p> */}
            <div className="t-bins-list t-mt-4">
              <h3 className="t-font-semibold">Requests</h3>
              {fetchedRequests.map((request, index) => (
                <div key={index} className="t-py-1 t-bg-gray-100">
                  {request.id}
                  {/* Display bin details */}
                  <div className="t-bins-list t-mt-4">
                    <h3 className="t-font-semibold">Bins:</h3>
                    {request.bins.map((bin) => (
                      <div key={bin.id} className="t-p-2 t-bg-gray-100 t-rounded-md t-mb-2 t-flex t-justify-between">
                        <div>
                          <p className='t-text-xs'>Bin ID: {bin.id}</p>
                          <p><strong>Bin Type:</strong> {bin.binType}</p>
                          <p><strong>Health:</strong> {bin.binHealth}</p>
                        </div>
                        <div className='t-mr-5 t-mt-auto t-mb-5'>
                          <FaTrash
                            className={
                              bin.binType === 'Organic'
                                ? 't-text-green-600 t-text-3xl'
                                : bin.binType === 'Polythene'
                                ? 't-text-red-500 t-text-3xl'
                                : 't-text-black t-text-3xl'
                            }
                          />
                          <span className='t-text-xl'>{bin.currentLevel}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="t-mt-4">
                    <button
                      className="t-px-4 t-py-2 t-bg-green-500 t-text-white t-rounded-lg t-hover:bg-green-600"
                      onClick={() => {
                        const location = request.bins[0].location; // Assuming this is your GeoPoint
                        const lat = location._lat; // Accessing the latitude
                        const long = location._long; // Accessing the longitude
                        console.log('Navigating to', location);

                        // Open Google Maps with the specified latitude and longitude
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`, '_blank');
                      }}
                    >
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

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
              disabled={currentDestinationIndex === fetchedRequests.length - 1}
              className={`t-px-4 t-py-2 t-rounded-lg ${
                currentDestinationIndex === fetchedRequests.length - 1 ? 't-bg-gray-300' : 't-bg-blue-500 t-text-white t-hover:bg-blue-600'
              }`}
            >
              Next Destination
            </button>
          </div>
        </div>
      )}

      {!(fetchedSchedule[0].status === 'Started') && <p className="t-text-gray-500">Start the session to view the destinations.</p>}
    </div>
  );
};

export default TodaySchedule;
