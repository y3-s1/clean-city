import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { doc, onSnapshot, collection, query, where, addDoc, deleteDoc, serverTimestamp, updateDoc, arrayUnion,GeoPoint } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WasteLevelMonitoring.css'; // Custom styles for layout
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';


Chart.register(...registerables);

const WasteLevelMonitoring = () => {
  const userId = 'S7xvf9vzXhvpdrxSEdgQ'; // Resident ID from your structure
  const [bins, setBins] = useState([]);
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(75);
  const [alerts, setAlerts] = useState([]);
  const [binHistory, setBinHistory] = useState({ labels: [], datasets: [] });
  const [newBinType, setNewBinType] = useState('Polythin');
  // const [location, setLocation] = useState('');
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612 });
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState(''); // State for success/error messages
  const [collectors, setCollectors] = useState({}); // Collectors' data stored by ID

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew',
  });




  useEffect(() => {
    const binsQuery = query(collection(db, 'Bins'), where('residentID', '==', userId));
    const requestsQuery = query(collection(db, 'WasteCollectionRequests'), where('residentID', '==', userId));

    const unsubscribeBins = onSnapshot(binsQuery, (querySnapshot) => {
      const binData = [];
      querySnapshot.forEach((doc) => {
        binData.push({ ...doc.data(), id: doc.id });
      });
      setBins(binData);
      checkAlert(binData);
      updateBinHistory(binData);
    });

    const unsubscribeRequests = onSnapshot(requestsQuery, (querySnapshot) => {
      const requestsData = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ ...doc.data(), id: doc.id });
      });
      setCollectionRequests(requestsData);
    });

    // Fetch all collectors' names from the Collectors collection
    const collectorsQuery = collection(db, 'collector');
    const unsubscribeCollectors = onSnapshot(collectorsQuery, (querySnapshot) => {
      const collectorsData = {};
      querySnapshot.forEach((doc) => {
        collectorsData[doc.id] = doc.data().collectorName;
      });
      setCollectors(collectorsData);
    });

    return () => {
      unsubscribeBins();
      unsubscribeRequests();
      unsubscribeCollectors();
    };
  }, [userId, alertThreshold]);

  const checkAlert = (bins) => {
    const alertMessages = [];
    bins.forEach(bin => {
      if (bin.currentLevel >= alertThreshold) {
        alertMessages.push(`Bin ${bin.binType} is ${bin.currentLevel}% full. Time to collect!`);
      }
    });
    setAlerts(alertMessages);
  };

  const updateBinHistory = (bins) => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = bins.map(bin => ({
      label: `${bin.binType} Usage`,
      data: [bin.currentLevel, bin.currentLevel - 10, bin.currentLevel - 20, bin.currentLevel + 10, bin.currentLevel + 20, bin.currentLevel],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    }));
    setBinHistory({ labels, datasets: data });
  };

  const handleThresholdChange = (e) => {
    setAlertThreshold(Number(e.target.value));
  };

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp.seconds * 1000).toLocaleString() : 'Not available';
  };

  const handleRequestDetails = (id) => {
    console.log(`Viewing details for request ID: ${id}`);
  };

  const handleAddBin = async (e) => {
    e.preventDefault();
    try {
      const newBinRef = await addDoc(collection(db, 'Bins'), {
        binType: newBinType,
        location,
        residentID: userId,
        currentLevel: 0,
        binHealth: 'Good',
        createdAt: serverTimestamp(),
        lastCollected: null,
        updatedAt: serverTimestamp(),
      });

      // Update the user's document by adding the new bin ID to the bins array
      const userDocRef = doc(db, 'Users', userId);
      await updateDoc(userDocRef, {
        bins: arrayUnion(newBinRef.id) // Appending the new bin ID to the bins array
      });

      setNewBinType('Polythin');
      setLocation('');
      alert('New bin added successfully!'); // Displaying a simple alert
      setMessage('New bin added successfully!'); // Set success message
    } catch (error) {
      console.error("Error adding new bin: ", error);
      setMessage('Error adding bin. Please try again.'); // Set error message
      alert('Error adding bin. Please try again.'); // Displaying a simple alert
    }
  };

  const handleRequestCollection = async () => {
    try {
      await addDoc(collection(db, 'WasteCollectionRequests'), {
        binID: bins.map(bin => bin.id),
        collectorID: '',
        createdAt: serverTimestamp(),
        residentID: userId,
        routeAssigned: '',
        scheduledTime: '',
        status: 'Pending',
        updatedAt: serverTimestamp(),
      });
      setScheduledTime('');
      alert('Waste collection request submitted successfully!');
    } catch (error) {
      console.error("Error requesting waste collection: ", error);
    }
  };

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm('Do you want to delete this request?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'WasteCollectionRequests', id));
        setMessage('Waste collection request deleted successfully!');
      } catch (error) {
        console.error("Error deleting waste collection request: ", error);
        setMessage('Error deleting waste collection request. Please try again.');
      }
    }
  };


  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
  
    // Set the location as a GeoPoint
    setLocation(new GeoPoint(lat, lng));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="main-content flex-fill p-3">
        <h1 className="text-center mb-4">Waste Level Monitoring Dashboard</h1>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {bins.map(bin => (
            <div key={bin.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className={`card ${bin.currentLevel >= alertThreshold ? 'border-danger' : 'border-success'}`}>
                <div className="card-body">
                  <h5 className="card-title">Bin Type: {bin.binType}</h5>
                  <ProgressBar
                    now={bin.currentLevel}
                    label={`${bin.currentLevel}%`}
                    variant={bin.currentLevel >= alertThreshold ? 'danger' : 'success'}
                  />
                  <p className="mt-2">Current Level: {bin.currentLevel}%</p>
                  <p className="text-muted">
                    Last Collected: {bin.lastCollected ? formatDate(bin.lastCollected) : 'Not collected yet'}
                  </p>
                  <p className="text-muted">Bin Health: {bin.binHealth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="alert-section mb-4">
          <h3>Set Custom Alert Threshold</h3>
          <input
            type="number"
            value={alertThreshold}
            onChange={handleThresholdChange}
            className="form-control mb-3"
            min="0"
            max="100"
          />
          {alerts.length > 0 && (
            <div className="alert alert-warning">
              {alerts.map((alert, index) => (
                <p key={index}>{alert}</p>
              ))}
            </div>
          )}
        </div>

        <div className="chart-section mb-4">
          <h3>Bin Usage History</h3>
          <div className="chart-container">
            <Line data={binHistory} />
          </div>
        </div>

        {/* Waste Collection Requests Section */}
        <div className="requests-section mb-4" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <h3 className="mb-4">Waste Collection Requests</h3>
          {collectionRequests.length > 0 ? (
            <div className="row">
              {collectionRequests.map((request) => {
                const bin = bins.find((b) => b.id === request.binID);
                const binType = bin ? bin.binType : 'Unknown Bin';
                const collectorName = collectors[request.collectorID] || 'Not Assigned';

                return (
                  <div key={request.id} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{binType} Collection Request</h5>
                        <p className="card-text">Status: {request.status}</p>
                        <p className="card-text">Scheduled Time: {request.scheduledTime || 'Not scheduled'}</p>
                        <p className="card-text">Assigned Collector: {collectorName}</p>
                        <p className="card-text">Created At: {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleString() : 'Not available'}</p>                      
                          {/* <button onClick={() => handleRequestDetails(request.id)} className="btn btn-info mr-2">View Details</button> */}
                        <button onClick={() => handleDeleteRequest(request.id)} className="btn btn-danger">Delete Request</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No waste collection requests available.</p>
          )}
        </div>

        {/* Add New Bin Section */}
        <div className="add-bin-section">
          <h3>Add New Waste Bin</h3>
          <form onSubmit={handleAddBin}>
            <div className="form-group">
              <label htmlFor="binType">Select Bin Type:</label>
              <select
                id="binType"
                value={newBinType}
                onChange={(e) => setNewBinType(e.target.value)}
                className="form-control"
              >
                <option value="Polythin">Polythin</option>
                <option value="Organic">Organic</option>
                <option value="Plastic">Plastic</option>
                <option value="Glass">Glass</option>
                <option value="Metal">Metal</option>
              </select>
            </div>
            
              <div className="form-group">
              <label htmlFor="location">Location</label>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ height: '400px', width: '100%' }}
                  center={location}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  <Marker position={location} />
                </GoogleMap>
              ) : (
                <div>Loading Map...</div>
              )}
            </div>
            <button type="submit" className="btn btn-success">Add Bin</button>
          </form>
        </div>

        {/* Request Waste Collection Section */}
        <div className="request-collection-section mt-4">
          <h3>Request Waste Collection</h3>
          <button onClick={handleRequestCollection} className="btn btn-success">Request Collection</button>
        </div>
      </div>
    </div>
  );
};

export default WasteLevelMonitoring;
