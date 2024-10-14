// import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/firebase'; // Firebase config
// import { collection, getDocs } from 'firebase/firestore'; // Firestore operations
// import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript } from '@react-google-maps/api'; // Google Maps components

// function AllSchedules() {
//     const [schedules, setSchedules] = useState([]);
//   const [directions, setDirections] = useState(null);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);

//   // Google Maps API key
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew",
//     libraries: ['places'],
//   });

//   // Fetch all schedules
//   useEffect(() => {
//     const fetchSchedules = async () => {
//       const schedulesCollection = collection(db, 'Schedules');
//       const schedulesSnapshot = await getDocs(schedulesCollection);
//       const schedulesData = [];
//       schedulesSnapshot.forEach((doc) => schedulesData.push({ id: doc.id, ...doc.data() }));
//       setSchedules(schedulesData);
//     };

//     fetchSchedules();
//   }, []);

  

//   // Handle schedule selection to show the route on the map
//   const handleScheduleClick = (schedule) => {
//     setSelectedSchedule(schedule);

//     const waypoints = schedule.binIds.map(binId => ({
//       location: binId.location, // Use the bin's location from the schedule
//       stopover: true,
//     }));

//     const directionsServiceOptions = {
//       origin: { lat: schedule.truckStartLat, lng: schedule.truckStartLng }, // Starting point of the truck
//       destination: waypoints[waypoints.length - 1].location, // The last bin is the destination
//       waypoints: waypoints.slice(0, -1), // All bins except the last one are waypoints
//       optimizeWaypoints: true,
//       travelMode: 'DRIVING',
//     };

//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(directionsServiceOptions, (result, status) => {
//       if (status === window.google.maps.DirectionsStatus.OK) {
//         setDirections(result);
//       } else {
//         console.error(`Error fetching directions ${result}`);
//       }
//     });
//   };

//   if (!isLoaded) {
//     return <div>Loading Google Maps...</div>;
//   }

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
      
//       {/* Display all schedules */}
//       <h3>Waste Collection Schedules</h3>
//       <ul>
//         {schedules.map(schedule => (
//           <li key={schedule.id}>
//             <button onClick={() => handleScheduleClick(schedule)}>
//               Truck: {schedule.truckId} | Bins: {schedule.binIds.length} | Priority Bins: {schedule.priorityBins.length}
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Google Maps Display */}
//       <div style={{ height: '500px', width: '100%' }}>
//         <GoogleMap
//           id="schedule-map"
//           mapContainerStyle={{ height: '500px', width: '100%' }}
//           zoom={10}
//           center={{ lat: 6.9271, lng: 79.8612 }} // Default center, adjust to truck start location
//         >
//           {selectedSchedule && (
//             <>
//               {directions && <DirectionsRenderer directions={directions} />}
//               <Marker position={{ lat: selectedSchedule.truckStartLat, lng: selectedSchedule.truckStartLng }} label="Truck Start" />
//               {selectedSchedule.binIds.map((bin, index) => (
//                 <Marker key={index} position={{ lat: bin.location.latitude, lng: bin.location.longitude }} label={`Bin ${index + 1}`} />
//               ))}
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// }

// export default AllSchedules