import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';

const categoryMap = {
  1: 'Household Waste',
  2: 'Recyclable Waste',
  3: 'E-Waste',
  4: 'Hazardous Waste',
  5: 'Bulky Waste',
  6: 'Green Waste',
  7: 'Textile Waste',
  8: 'Special Event Waste',
};

const statusStyles = {
  pending: 'text-primary',
  accepted: 'text-success',
  cancelled: 'text-danger',
};

const SpecialRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // Filter state

  const userId = '8oO1oaRzfEWFaHJaOCUk'; // Fixed user ID

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestCollectionRef = collection(db, 'Users', userId, 'SpecialWasteRequests');
        const querySnapshot = await getDocs(requestCollectionRef);
        const requestsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'Users', userId, 'SpecialWasteRequests', requestId));
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Filter requests based on selected filter
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter((request) => request.status.toLowerCase() === filter);

  return (
    <div className="container display-6">
      <h1 className="display-6 mb-4 mt-3 text-center">Special Waste Collection Requests</h1>

      {/* Filter options */}
      <div className="d-flex justify-content-end mb-4">
        <FormControl variant="outlined" size="small" className="w-auto">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </div>

      {filteredRequests.length === 0 ? (
        <Alert severity="info">No requests found</Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Location: {request.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pickup Date:</strong> {request.pickupDate} <br />
                    <strong>Pickup Time:</strong> {request.pickupTime} <br />
                    <strong>Total Charge:</strong> Rs.{request.totalCharge.toFixed(2)} <br />
                    <strong>Payment Method:</strong> {request.paymentMethod} <br />
                    <strong>Categories:</strong>{' '}
                    {request.selectedCategories.map((cat) => (
                      <span key={cat.id}>
                        {categoryMap[cat.id] || 'Unknown Category'} (Amount: {cat.amount} kg)
                        {request.selectedCategories.length - 1 !== cat.id && ', '}
                      </span>
                    ))}
                  </Typography>
                </CardContent>
                <CardActions className={`d-flex justify-content-between ${statusStyles[request.status.toLowerCase()]}`}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {request.status}
                  </Typography>
                  {/* Delete button: only show if status is pending or cancelled */}
                  {['pending', 'cancelled'].includes(request.status.toLowerCase()) && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(request.id)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SpecialRequestList;
