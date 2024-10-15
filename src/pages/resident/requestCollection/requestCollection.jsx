import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const RequestCollection = () => {
  const [binHealth, setBinHealth] = useState('');
  const [binType, setBinType] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [humanAddress, setHumanAddress] = useState('');
  const [binID, setBinID] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mapClicked, setMapClicked] = useState(false);

  // Google Maps API key (Replace with your key)
  const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

  // Map container style
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  // Default location (center of map)
  const defaultCenter = {
    lat: 7.8731,
    lng: 80.7718,
  };

  // Handle Google Map click to get latitude and longitude
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocation({ lat, lng });
    setMapClicked(true);
    convertToAddress(lat, lng); // Convert lat-lng to human-readable address
  };

  // Convert lat-lng to human-readable address using Google Maps Geocoding API
  const convertToAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      );
      const formattedAddress = response.data.results[0]?.formatted_address || 'Address not found';
      setHumanAddress(formattedAddress);
      setAddress(formattedAddress); // Save the address
    } catch (error) {
      console.error('Error converting to human-readable address:', error);
    }
  };

  // Submit form to save bin details and collection request
  const handleSubmit = (e) => {
    e.preventDefault();
    const binData = {
      binHealth,
      binType,
      location: humanAddress,
      createdAt: new Date().toISOString(),
      currentLevel: 0, // Assuming initial level is 0
    };

    const collectionRequestData = {
      binID,
      scheduledTime,
      address,
      email,
      name,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // You can replace this with the actual POST request to save in your database
    console.log('Saving Bin Data:', binData);
    console.log('Saving Collection Request Data:', collectionRequestData);

    // Reset form fields after submission
    setBinHealth('');
    setBinType('');
    setBinID('');
    setScheduledTime('');
    setAddress('');
    setEmail('');
    setName('');
  };

  return (
    <div className="container mt-4">
      <h3>Add a New Bin</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bin Health</label>
          <input
            type="text"
            className="form-control"
            value={binHealth}
            onChange={(e) => setBinHealth(e.target.value)}
            placeholder="Enter Bin Health (e.g., Damaged, Good)"
          />
        </div>

        <div className="form-group">
          <label>Bin Type</label>
          <input
            type="text"
            className="form-control"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            placeholder="Enter Bin Type (e.g., Polythin)"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <div style={containerStyle}>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onClick={handleMapClick}
              >
                {mapClicked && <Marker position={location} />}
              </GoogleMap>
            </LoadScript>
          </div>
          <small className="form-text text-muted">
            {humanAddress ? `Selected Address: ${humanAddress}` : 'Click on the map to select a location.'}
          </small>
        </div>

        <h4>Request Waste Collection</h4>

        <div className="form-group">
          <label>Bin ID</label>
          <input
            type="text"
            className="form-control"
            value={binID}
            onChange={(e) => setBinID(e.target.value)}
            placeholder="Enter Bin ID"
          />
        </div>

        <div className="form-group">
          <label>Scheduled Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Address"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestCollection;
