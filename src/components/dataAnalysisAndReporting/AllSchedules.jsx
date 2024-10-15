import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Firebase config
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Firestore operations
import { GoogleMap, LoadScript, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import polyline from 'polyline'; // Add polyline library for decoding
import { FaTruck, FaTrash, FaUserAlt } from 'react-icons/fa'; // Importing icons

function AllSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [decodedPolyline, setDecodedPolyline] = useState([]); // State to store the decoded polyline points
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo, Sri Lanka

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedulesCollection = collection(db, 'ScheduledCollections');
      const schedulesSnapshot = await getDocs(schedulesCollection);
      const schedulesData = [];
      schedulesSnapshot.forEach((doc) => schedulesData.push({ id: doc.id, ...doc.data() }));
      setSchedules(schedulesData);
    };
    fetchSchedules();
  }, []);

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);

    if (schedule.route) {
      // Decode the polyline into LatLng points
      const decodedPolyline = polyline.decode(schedule.route).map(([lat, lng]) => ({ lat, lng }));
      setDecodedPolyline(decodedPolyline); // Set the decoded polyline state
      
      // Set the map center to the first point of the decoded polyline
      if (decodedPolyline.length > 0) {
        setMapCenter(decodedPolyline[0]);
      }

      // Create directions response using the decoded polyline
      if (decodedPolyline.length >= 2) {
        setDirectionsResponse({
          origin: decodedPolyline[0],
          destination: decodedPolyline[decodedPolyline.length - 1],
          waypoints: decodedPolyline.slice(1, decodedPolyline.length - 1).map(point => ({ location: point, stopover: true })),
          travelMode: 'DRIVING',
        });
      }
    }
  };

  // Optimize the route based on high-priority bins (bins with waste level > 75%)
  const optimizeRoute = async () => {
    if (!selectedSchedule || !selectedSchedule.binIds) return;

    // Fetch bins and their waste levels
    const binsCollection = collection(db, 'Bins');
    const binsSnapshot = await getDocs(binsCollection);
    const highPriorityBins = [];

    binsSnapshot.forEach((doc) => {
      const binData = doc.data();
      if (binData.currentLevel > 75 && selectedSchedule.binIds.includes(doc.id)) {
        highPriorityBins.push({ binId: doc.id, location: binData.location });
      }
    });

    if (highPriorityBins.length >= 2) {
      const waypoints = highPriorityBins.map(bin => ({
        location: { lat: bin.location.latitude, lng: bin.location.longitude },
        stopover: true,
      }));

      const optimizedRequest = {
        origin: waypoints[0].location,
        destination: waypoints[waypoints.length - 1].location,
        waypoints: waypoints.slice(1, waypoints.length - 1),
        travelMode: 'DRIVING',
      };

      setDirectionsResponse(optimizedRequest);

      // Save the optimized route to Firestore
      const scheduleRef = doc(db, 'Schedules', selectedSchedule.id);
      await updateDoc(scheduleRef, {
        route: optimizedRequest,
      });
      alert('Route optimized based on high-priority bins and saved!');
    } else {
      alert('Not enough high-priority bins to optimize the route.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px' }}>
      {/* Left Section - Schedule List */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#333' }}>Waste Collection Schedules</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {schedules.map(schedule => (
            <li key={schedule.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
              <FaTruck style={{ color: '#4CAF50', marginRight: '10px' }} />
              <button 
                onClick={() => handleScheduleSelect(schedule)} 
                style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                View Truck {schedule.truckId}
              </button>
            </li>
          ))}
        </ul>

        {/* Selected Schedule Details */}
        {selectedSchedule && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '20px', color: '#333' }}>Schedule Details</h3>
            <p><FaTruck style={{ color: '#2196F3', marginRight: '5px' }} /> Truck ID: {selectedSchedule.truckId}</p>
            <p><FaTrash style={{ color: '#FF5722', marginRight: '5px' }} /> Bins: {selectedSchedule.binIds.join(', ')}</p>
            <p><FaUserAlt style={{ color: '#9C27B0', marginRight: '5px' }} /> Workers: {selectedSchedule.workers.join(', ')}</p>
            <button 
              onClick={optimizeRoute} 
              style={{ backgroundColor: '#FF5722', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
              Optimize Route
            </button>
          </div>
        )}
      </div>

      {/* Right Section - Google Map */}
      <div style={{ height: '100%', padding: '0' }}>
        <LoadScript googleMapsApiKey="AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '500px', borderRadius: '8px' }}
            center={mapCenter}
            zoom={13}
          >
            {/* DirectionsRenderer to show the driving directions */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={{
                  origin: directionsResponse.origin,
                  destination: directionsResponse.destination,
                  waypoints: directionsResponse.waypoints,
                  travelMode: 'DRIVING',
                }}
              />
            )}

            {/* Polyline to mark the route on the map */}
            {decodedPolyline.length > 0 && (
              <Polyline
                path={decodedPolyline}
                options={{
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default AllSchedules;
