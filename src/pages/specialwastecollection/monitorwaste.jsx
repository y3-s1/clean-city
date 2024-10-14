import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const MonitorWaste = () => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const userId = '8oO1oaRzfEWFaHJaOCUk'; // Fixed user ID

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const wasteCollectionRef = collection(db, 'Users', userId, 'SpecialWasteRequests');
        const querySnapshot = await getDocs(wasteCollectionRef);
        const wasteList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWasteData(wasteList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching waste data:', err);
        setError('Failed to load waste data');
        setLoading(false);
      }
    };

    fetchWasteData();
  }, []);

  if (loading) return <Typography>Loading waste data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const filteredWasteData = wasteData.filter(waste => 
    waste.status.toLowerCase() === 'accepted' &&
    (categoryFilter === '' || waste.selectedCategories.some(cat => categoryMap[cat.id].toLowerCase().includes(categoryFilter.toLowerCase()))) &&
    (dateFilter === 'all' || new Date(waste.pickupDate) >= new Date(dateFilter)) &&
    waste.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aggregatedData = filteredWasteData.reduce((acc, waste) => {
    waste.selectedCategories.forEach(cat => {
      const categoryName = categoryMap[cat.id] || 'Unknown Category';
      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, cost: 0 };
      }
      acc[categoryName].amount += Number(cat.amount);
      // Assuming the cost is proportional to the amount for each category
      acc[categoryName].cost += (Number(cat.amount) / waste.selectedCategories.reduce((total, c) => total + Number(c.amount), 0)) * waste.totalCharge;
    });
    return acc;
  }, {});

  return (
    <div className="container mt-4 display-6">
      <h1 className="display-6 mb-4">Special Waste Monitoring</h1>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <TextField
            label="Search by category"
            variant="outlined"
            fullWidth
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Date Filter</InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              label="Date Filter"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>Last 7 Days</MenuItem>
              <MenuItem value={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>Last 30 Days</MenuItem>
              <MenuItem value={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <Typography variant="h6" gutterBottom>Total Accepted Waste by Category</Typography>
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Total Amount (kg)</TableCell>
              <TableCell align="right">Total Cost (Rs.)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(aggregatedData).map(([category, data]) => (
              <TableRow key={category}>
                <TableCell component="th" scope="row">{category}</TableCell>
                <TableCell align="right">{data.amount.toFixed(2)}</TableCell>
                <TableCell align="right">{data.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MonitorWaste;