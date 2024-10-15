import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { doc, onSnapshot, collection, query, where, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WasteLevelMonitoring.css'; // Custom styles for layout

Chart.register(...registerables);

const WasteLevelMonitoring = () => {
  const userId = '8oO1oaRzfEWFaHJaOCUk'; // Resident ID from your structure
  const [bins, setBins] = useState([]);
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(75);
  const [alerts, setAlerts] = useState([]);
  const [binHistory, setBinHistory] = useState({ labels: [], datasets: [] });
  const [newBinType, setNewBinType] = useState('Polythin');
  const [location, setLocation] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState(''); // State for success/error messages

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

    return () => {
      unsubscribeBins();
      unsubscribeRequests();
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

  // Function to add a new bin
  const handleAddBin = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Bins'), {
        binType: newBinType,
        location,
        residentID: userId,
        currentLevel: 0,
        binHealth: 'Good',
        createdAt: serverTimestamp(),
        lastCollected: null,
        updatedAt: serverTimestamp(),
      });
      // Reset form fields
      setNewBinType('Polythin');
      setLocation('');
    } catch (error) {
      console.error("Error adding new bin: ", error);
    }
  };

  // Function to request waste collection
  const handleRequestCollection = async () => {
    try {
      await addDoc(collection(db, 'WasteCollectionRequests'), {
        binID: bins.map(bin => bin.id), // Add all bin IDs or you can modify this to select specific bins
        collectorID: '',
        createdAt: serverTimestamp(),
        residentID: userId,
        routeAssigned: '',
        scheduledTime: '', // Convert to Date object
        status: 'Pending',
        updatedAt: serverTimestamp(),
      });
      setScheduledTime(''); // Reset the scheduled time
      alert('Waste collection request submitted successfully!');
    } catch (error) {
      console.error("Error requesting waste collection: ", error);
    }
  };

  // Function to delete a waste collection request
  const handleDeleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, 'WasteCollectionRequests', id));
      setMessage('Waste collection request deleted successfully!');
    } catch (error) {
      console.error("Error deleting waste collection request: ", error);
      setMessage('Error deleting waste collection request. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="main-content flex-fill p-3">
        <h1 className="text-center mb-4">Waste Level Monitoring Dashboard</h1>

        {/* Success/Error Message */}
        {message && <div className="alert alert-info">{message}</div>}

        {/* Real-Time Bin Levels */}
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

        {/* Custom Alert Section */}
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

        {/* Bin Usage History */}
        <div className="chart-section mb-4">
          <h3>Bin Usage History</h3>
          <div className="chart-container">
            <Line data={binHistory} />
          </div>
        </div>

        {/* Waste Collection Requests Section */}
        <div className="requests-section mb-4">
          <h3 className="mb-4">Waste Collection Requests</h3>
          {collectionRequests.length > 0 ? (
            <div className="row">
              {collectionRequests.map((request) => {
                const bin = bins.find((b) => b.id === request.binID);
                const binType = bin ? bin.binType : 'Unknown Bin';

                return (
                  <div key={request.id} className="col-12 col-md-6 mb-4">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{binType}</h5>
                        <p className="card-text">
                          <strong>Scheduled Time:</strong> {request.scheduledTime ? formatDate(request.scheduledTime) : 'Date not available'}
                        </p>
                        <p className="card-text">
                          <strong>Collector ID:</strong> {request.collectorID || 'Not assigned'}
                        </p>
                        <p className="card-text">
                          <strong>Status:</strong> <span className={`badge ${request.status === 'Pending' ? 'bg-warning' : request.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>{request.status}</span>
                        </p>
                        <div className="d-flex justify-content-between">
                          {/* Update button can be added here for other functionalities */}
                          <button className="btn btn-danger" onClick={() => handleDeleteRequest(request.id)}>Delete</button>
                        </div>
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

        {/* Form to add a new bin */}
        <form onSubmit={handleAddBin} className="mb-4">
          <h3>Add New Bin</h3>
          <div className="form-group">
            <label>Bin Type</label>
            <select value={newBinType} onChange={(e) => setNewBinType(e.target.value)} className="form-control">
              <option value="Polythin">Polythin</option>
              <option value="Organic">Organic</option>
              <option value="Recyclable">Recyclable</option>
              {/* Add other bin types as needed */}
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Bin</button>
        </form>

        {/* Form to request waste collection */}
        <div>
          <h3>Request Waste Collection</h3>
          <button onClick={handleRequestCollection} className="btn btn-success">Request Collection</button>
        </div>
      </div>
    </div>
  );
};

export default WasteLevelMonitoring;
