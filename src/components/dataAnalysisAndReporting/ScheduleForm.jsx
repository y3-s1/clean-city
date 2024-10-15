import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Firebase config
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Firestore operations
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormGroup, 
  FormControlLabel, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Tooltip
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RouteIcon from '@mui/icons-material/Route';

function ScheduleForm() {
  const [trucks, setTrucks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [route, setRoute] = useState('');

  // Fetch trucks and requests from Firestore
  useEffect(() => {
    const fetchTrucks = async () => {
      const truckCollectionRef = collection(db, 'trucks');
      const truckSnapshot = await getDocs(truckCollectionRef);
      setTrucks(truckSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchRequests = async () => {
      const requestCollectionRef = collection(db, 'WasteCollectionRequests');
      const requestSnapshot = await getDocs(requestCollectionRef);
      setRequests(requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTrucks();
    fetchRequests();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the scheduled route data to Firestore
      await addDoc(collection(db, 'ScheduledCollections'), {
        truckId: selectedTruck,
        requestIds: selectedRequests,
        route,
        scheduledTime: new Date(),
      });

      alert('Waste collection scheduled successfully');
      // Reset form
      setSelectedTruck('');
      setSelectedRequests([]);
      setRoute('');
    } catch (error) {
      console.error('Error scheduling collection:', error);
      alert('Failed to schedule collection');
    }
  };

  return (
    <Card style={{ maxWidth: 900, margin: 'auto', padding: '20px 5px' }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Schedule Waste Collection
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            
            {/* Truck Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>
                  <LocalShippingIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  Select Truck
                </InputLabel>
                <Select
                  value={selectedTruck}
                  onChange={(e) => setSelectedTruck(e.target.value)}
                  required
                >
                  <MenuItem value="">
                    <em>Select a truck</em>
                  </MenuItem>
                  {trucks.map(truck => (
                    <MenuItem key={truck.id} value={truck.id}>
                      {truck.truckName} - {truck.registeredNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Request Selection */}
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography>
                  <CheckBoxIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  Select Requests
                </Typography>
                <FormGroup>
                  <Grid container>
                    {requests.map(request => (
                      <Grid item xs={6} key={request.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={request.id}
                              checked={selectedRequests.includes(request.id)}
                              onChange={(e) => {
                                const requestId = e.target.value;
                                setSelectedRequests(prev =>
                                  prev.includes(requestId)
                                    ? prev.filter(id => id !== requestId)
                                    : [...prev, requestId]
                                );
                              }}
                            />
                          }
                          label={`Request ID: ${request.id}`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>

            {/* Route Input */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label={
                    <>
                      <RouteIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                      Collection Route
                    </>
                  }
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  placeholder="Enter route details"
                  required
                />
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Tooltip title="Schedule the waste collection">
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Schedule Collection
                </Button>
              </Tooltip>
            </Grid>

          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default ScheduleForm;
