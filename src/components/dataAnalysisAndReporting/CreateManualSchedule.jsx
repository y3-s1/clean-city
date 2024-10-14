import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Firebase config
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore operations

const CreateManualSchedule = () => {
  const [trucks, setTrucks] = useState([]);
  const [bins, setBins] = useState([]);
  const [wasteRequests, setWasteRequests] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedBins, setSelectedBins] = useState([]);
  
  useEffect(() => {
    // Fetch Trucks
    const fetchTrucks = async () => {
      const trucksCollection = collection(db, 'trucks');
      const trucksSnapshot = await getDocs(trucksCollection);
      const trucksData = [];
      trucksSnapshot.forEach((doc) => trucksData.push({ id: doc.id, ...doc.data() }));
      setTrucks(trucksData);
    };

    // Fetch Bins and Waste Requests
    const fetchBinsAndRequests = async () => {
      const binsCollection = collection(db, 'Bins');
      const binsSnapshot = await getDocs(binsCollection);
      const binsData = [];
      
      // Fetch waste collection requests to prioritize requested bins
      const requestsCollection = collection(db, 'WasteCollectionRequests');
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsData = [];
      requestsSnapshot.forEach((doc) => requestsData.push(doc.data()));
      
      binsSnapshot.forEach((doc) => {
        const binData = doc.data();
        const isRequested = requestsData.some(request => 
          Array.isArray(request.binIds) && request.binIds.includes(doc.id)
        ); // Check if bin is requested and binIds exists
        binsData.push({ id: doc.id, ...binData, priority: isRequested ? 1 : 0 }); // Priority 1 for requested bins
      });
      
      // Sort bins by priority (user requests first)
      binsData.sort((a, b) => b.priority - a.priority);
      setBins(binsData);
      setWasteRequests(requestsData);
    };

    fetchTrucks();
    fetchBinsAndRequests();
  }, []);

  // Handle truck selection
  const handleTruckChange = (e) => {
    setSelectedTruck(e.target.value);
  };

  // Handle bin selection
  const handleBinSelection = (binId) => {
    setSelectedBins(prevSelected => {
      if (prevSelected.includes(binId)) {
        return prevSelected.filter(id => id !== binId);
      } else {
        return [...prevSelected, binId];
      }
    });
  };

  // Create the manual waste collection schedule
  const createSchedule = async () => {
    if (!selectedTruck || selectedBins.length === 0) {
      alert("Please select a truck and at least one bin");
      return;
    }

    const routeDetails = {
      truckId: selectedTruck,
      binIds: selectedBins,
      created_at: serverTimestamp(),
      workers: ["Worker 1", "Worker 2"], // Example workers, you can modify as needed
      priorityBins: selectedBins.filter(binId => bins.find(bin => bin.id === binId && bin.priority === 1)),
    };

    await addDoc(collection(db, 'Schedules'), routeDetails);
    alert('Schedule created successfully!');
  };

  return (
    <div>
      <h2>Create Manual Waste Collection Schedule</h2>

      {/* Truck Selection */}
      <label>Select Truck:</label>
      <select value={selectedTruck} onChange={handleTruckChange}>
        <option value="">--Select Truck--</option>
        {trucks.map(truck => (
          <option key={truck.id} value={truck.id}>{truck.truckName}</option>
        ))}
      </select>

      {/* Bin Selection */}
      <h3>Select Bins to Collect (User-requested bins prioritized)</h3>
      <ul>
        {bins.map(bin => (
          <li key={bin.id}>
            <input
              type="checkbox"
              value={bin.id}
              checked={selectedBins.includes(bin.id)}
              onChange={() => handleBinSelection(bin.id)}
            />
            {bin.location.latitude}, {bin.location.longitude} 
            {bin.priority === 1 && <span style={{ color: 'red' }}> (Priority)</span>}
          </li>
        ))}
      </ul>

      <button onClick={createSchedule}>Create Schedule</button>
    </div>
  );
};

export default CreateManualSchedule;
