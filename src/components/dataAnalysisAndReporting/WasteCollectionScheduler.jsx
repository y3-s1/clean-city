import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Your Firebase config
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Firestore operations
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const WasteCollectionScheduler = () => {
  const [highPriorityBins, setHighPriorityBins] = useState([]);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    // Fetch high-priority bins when the component mounts
    const fetchHighPriorityBins = async () => {
      const binsCollection = collection(db, "Bins");
      const binsSnapshot = await getDocs(binsCollection);
      const bins = [];

      binsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("data", data.currentLevel);
        if (data.currentLevel > 75) {
          // If waste level is more than 75%
          console.log("first");
          bins.push({ binId: doc.id, location: data.location });
        }
      });

      setHighPriorityBins(bins);
      console.log("highPriorityBins", highPriorityBins);
    };

    fetchHighPriorityBins();
  }, []);

  // Create the waste collection route
  const createWasteCollectionRoute = () => {
    if (highPriorityBins.length === 0) {
      console.log("No high-priority bins found.");
      return;
    }

    const waypoints = highPriorityBins.map((bin) => ({
      location: { lat: bin.location.latitude, lng: bin.location.longitude },
      stopover: true,
    }));

    const origin = waypoints[0].location;
    const destination = waypoints[waypoints.length - 1].location;

    const directionsServiceOptions = {
      origin: origin,
      destination: destination,
      waypoints: waypoints.slice(1, waypoints.length - 1),
      optimizeWaypoints: true,
      travelMode: "DRIVING",
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(directionsServiceOptions, (result, status) => {
      if (status === "OK") {
        setDirections(result);
        console.log("Route created successfully");

        // Save route to Firebase
        const truckId = "example_truck_id"; // Assign to a truck
        const routeDetails = {
          truckId,
          route: result.routes[0].overview_polyline,
          waypoints: highPriorityBins.map((bin) => bin.binId),
          timestamp: serverTimestamp(),
        };

        addDoc(collection(db, "Schedules"), routeDetails).then(() => {
          console.log("Route saved to Firebase");
        });
      } else {
        console.error("Failed to create route:", status);
      }
    });
  };

  return (
    <div>
      <h2>Waste Collection Route Scheduler</h2>
      <button onClick={createWasteCollectionRoute}>
        Create Optimized Route
      </button>

      {/* Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={
            highPriorityBins.length > 0
              ? {
                  lat: highPriorityBins[0].location.latitude,
                  lng: highPriorityBins[0].location.longitude,
                }
              : { lat: 6.9271, lng: 79.8612 }
          } // Default center Colombo
          zoom={10}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default WasteCollectionScheduler;
