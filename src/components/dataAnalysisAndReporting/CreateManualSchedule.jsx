import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { LoadScript, DirectionsService } from "@react-google-maps/api";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  OutlinedInput,
} from "@mui/material";

const CreateManualSchedule = () => {
  const [trucks, setTrucks] = useState([]);
  const [bins, setBins] = useState([]);
  const [wasteRequests, setWasteRequests] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [selectedBins, setSelectedBins] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]); // Updated for multiple selections
  const [route, setRoute] = useState(null);
  const [isProcessingRoute, setIsProcessingRoute] = useState(false);

  useEffect(() => {
    const fetchTrucks = async () => {
      const trucksCollection = collection(db, "trucks");
      const trucksSnapshot = await getDocs(trucksCollection);
      const trucksData = [];
      trucksSnapshot.forEach((doc) =>
        trucksData.push({ id: doc.id, ...doc.data() })
      );
      setTrucks(trucksData);
    };

    const fetchBinsAndRequests = async () => {
      const binsCollection = collection(db, "Bins");
      const binsSnapshot = await getDocs(binsCollection);
      const binsData = [];
      const requestsCollection = collection(db, "WasteCollectionRequests");
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsData = [];
      requestsSnapshot.forEach((doc) => requestsData.push(doc.data()));
      binsSnapshot.forEach((doc) => {
        const binData = doc.data();
        const isRequested = requestsData.some(
          (request) =>
            Array.isArray(request.binIds) && request.binIds.includes(doc.id)
        );
        binsData.push({
          id: doc.id,
          ...binData,
          priority: isRequested ? 1 : 0,
        });
      });
      binsData.sort((a, b) => b.priority - a.priority);
      setBins(binsData);
      setWasteRequests(requestsData);
    };

    fetchTrucks();
    fetchBinsAndRequests();
  }, []);

  const handleTruckChange = (e) => {
    setSelectedTruck(e.target.value);
  };

  const handleBinSelection = (binId) => {
    setSelectedBins((prevSelected) =>
      prevSelected.includes(binId)
        ? prevSelected.filter((id) => id !== binId)
        : [...prevSelected, binId]
    );
  };

  const handleRequestChange = (e) => {
    const value = e.target.value;
    setSelectedRequests(typeof value === "string" ? value.split(",") : value);
  };

  const handleDirectionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      const routeData = {
        route: response.routes[0].overview_polyline,
        waypoints: response.routes[0].legs[0].via_waypoints.map((wp) => ({
          location: {
            lat: wp.location.lat(),
            lng: wp.location.lng(),
          },
          stopover: true,
        })),
      };
      setRoute(routeData);
      setIsProcessingRoute(false);
    } else {
      console.error("Error fetching route:", response);
      setIsProcessingRoute(false);
    }
  };

  const createSchedule = async () => {
    if (!selectedTruck || selectedBins.length === 0 || !route) {
      alert(
        "Please select a truck, at least one bin, and ensure route is generated."
      );
      return;
    }

    const routeDetails = {
      truckId: selectedTruck,
      binIds: selectedBins,
      requestIds: selectedRequests, // Save selected requests
      route: route?.route || null,
      waypoints: route?.waypoints || [],
      created_at: serverTimestamp(),
      workers: ["Worker 1", "Worker 2"],
      priorityBins: selectedBins.filter((binId) =>
        bins.find((bin) => bin.id === binId && bin.priority === 1)
      ),
    };

    await addDoc(collection(db, "ScheduledCollections"), routeDetails);
    alert("Schedule created successfully!");
  };

  useEffect(() => {
    if (selectedBins.length > 0) {
      setIsProcessingRoute(true);
      const originBin = bins.find((bin) => bin.id === selectedBins[0]);
      const destinationBin = bins.find(
        (bin) => bin.id === selectedBins[selectedBins.length - 1]
      );

      if (originBin && destinationBin) {
        const origin = {
          lat: originBin.location.latitude,
          lng: originBin.location.longitude,
        };
        const destination = {
          lat: destinationBin.location.latitude,
          lng: destinationBin.location.longitude,
        };
        const waypoints = selectedBins
          .slice(1, selectedBins.length - 1)
          .map((binId) => {
            const bin = bins.find((b) => b.id === binId);
            return {
              location: {
                lat: bin.location.latitude,
                lng: bin.location.longitude,
              },
              stopover: true,
            };
          });

        setRoute({ origin, destination, waypoints });
      }
    }
  }, [selectedBins, bins]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Create Manual Waste Collection Schedule
      </Typography>

      {/* Truck Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="truck-select-label">Select Truck</InputLabel>
        <Select
          labelId="truck-select-label"
          value={selectedTruck}
          onChange={handleTruckChange}
        >
          <MenuItem value="">
            <em>--Select Truck--</em>
          </MenuItem>
          {trucks.map((truck) => (
            <MenuItem key={truck.id} value={truck.id}>
              {truck.truckName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Request Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="request-select-label">Select Waste Requests</InputLabel>
        <Select
          labelId="request-select-label"
          multiple
          value={selectedRequests}
          onChange={handleRequestChange}
          input={<OutlinedInput label="Select Waste Requests" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {wasteRequests.map((request, index) => (
            <MenuItem key={index} value={request.id || index}>
              <Checkbox
                checked={selectedRequests.includes(request.id || index)}
              />
              <ListItemText primary={`Request ${index + 1}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Bin Selection */}
      <Typography variant="h6" gutterBottom>
        Select Bins to Collect (User-requested bins prioritized)
      </Typography>
      <List>
        {bins.map((bin) => (
          <ListItem
            key={bin.id}
            button
            onClick={() => handleBinSelection(bin.id)}
          >
            <Checkbox checked={selectedBins.includes(bin.id)} color="primary" />
            <ListItemText
              primary={`Bin at (${bin.location.latitude}, ${bin.location.longitude})`}
              secondary={
                bin.priority === 1 && (
                  <span style={{ color: "red" }}>Priority</span>
                )
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Display route and DirectionsService */}
      <LoadScript googleMapsApiKey="AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew">
        {selectedBins.length > 0 && isProcessingRoute && route && (
          <DirectionsService
            options={{
              origin: route.origin,
              destination: route.destination,
              waypoints: route.waypoints,
              travelMode: "DRIVING",
            }}
            callback={handleDirectionsCallback}
          />
        )}
      </LoadScript>

      <Button
        variant="contained"
        color="primary"
        onClick={createSchedule}
        disabled={isProcessingRoute || !route}
        startIcon={isProcessingRoute ? <CircularProgress size={24} /> : null}
        fullWidth
      >
        {isProcessingRoute ? "Processing Route..." : "Create Schedule"}
      </Button>
    </div>
  );
};

export default CreateManualSchedule;
