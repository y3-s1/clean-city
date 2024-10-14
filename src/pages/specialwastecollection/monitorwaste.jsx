import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const filteredWasteData = wasteData.filter(waste => {
    const isAccepted = waste.status.toLowerCase() === 'accepted';
    const matchesCategory = categoryFilter === '' || 
      waste.selectedCategories.some(cat => 
        categoryMap[cat.id]?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    const matchesDate = dateFilter === 'all' || new Date(waste.pickupDate) >= new Date(dateFilter);
  
    return isAccepted && matchesCategory && matchesDate;
  });

  const aggregatedData = filteredWasteData.reduce((acc, waste) => {
    waste.selectedCategories.forEach(cat => {
      const categoryName = categoryMap[cat.id] || 'Unknown Category';
      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, cost: 0 };
      }
      acc[categoryName].amount += Number(cat.amount);
      acc[categoryName].cost += (Number(cat.amount) / waste.selectedCategories.reduce((total, c) => total + Number(c.amount), 0)) * waste.totalCharge;
    });
    return acc;
  }, {});

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Special Waste Monitoring Report', 14, 22);
    
    // Table Header
    const tableHead = [['Category', 'Total Amount (kg)', 'Total Cost (Rs.)']];
    const tableData = Object.entries(aggregatedData).map(([category, data]) => [
      category,
      data.amount.toFixed(2),
      data.cost.toFixed(2),
    ]);

    // Table
    autoTable(doc, {
      head: tableHead,
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: '#8BC34A' },
      styles: { cellPadding: 3, fontSize: 10 },
      margin: { top: 10 },
    });

    // Save PDF
    doc.save('waste_monitoring_report.pdf');
  };

  return (
    <div className="container mt-4">
      <h1 className="display-6 mb-4">Special Waste Monitoring</h1>
      
      {/* Filter and search bar */}
      <div className="d-flex justify-content-end mb-4">
        <FormControl variant="outlined" style={{ width: 'auto' }}>
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

      <Button
        variant="contained"
        style={{ backgroundColor: '#8BC34A', color: '#FFFFFF', marginBottom: '20px' }}
        onClick={generatePDF}
      >
        Generate PDF
      </Button>

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
