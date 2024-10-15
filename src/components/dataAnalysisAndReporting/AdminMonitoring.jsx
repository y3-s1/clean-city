import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Firebase config
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2'; // Use react-chartjs-2 for rendering charts
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table generation in jsPDF
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminMonitoring() {
  const [totalWasteCollected, setTotalWasteCollected] = useState(0);
  const [wastePerHousehold, setWastePerHousehold] = useState(0);
  const [collectionEfficiency, setCollectionEfficiency] = useState(0);
  const [recyclingPercentage, setRecyclingPercentage] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchWasteData = async () => {
      // Fetch completed waste data and compute totals
      const wasteCollectionRef = collection(db, 'WasteCollectionRequests');
      const completedQuery = query(wasteCollectionRef, where('status', '==', 'Completed'));
      const wasteSnapshot = await getDocs(completedQuery);
      let totalWaste = 0;
      let actualWasteCollectedSum = 0;
      let recycledWasteSum = 0;

      for (const doc of wasteSnapshot.docs) {
        const wasteRequest = doc.data();
        totalWaste += wasteRequest.totalWaste || 0;
        actualWasteCollectedSum += wasteRequest.collectedWaste || 0;
        recycledWasteSum += wasteRequest.recycledWaste || 0;
      }

      setTotalWasteCollected(totalWaste);
      setCollectionEfficiency(((actualWasteCollectedSum / totalWaste) * 100).toFixed(2));
      setRecyclingPercentage(((recycledWasteSum / totalWaste) * 100).toFixed(2));
    };

    const fetchRecentRequests = async () => {
      const wasteCollectionRef = collection(db, 'WasteCollectionRequests');
      const wasteSnapshot = await getDocs(wasteCollectionRef);
      const recentRequestsData = wasteSnapshot.docs.slice(0, 5).map(doc => doc.data());
      setRecentRequests(recentRequestsData);
    };

    fetchWasteData();
    fetchRecentRequests();
  }, []);

  const pieData = {
    labels: ['Recycled Waste', 'Non-Recycled Waste'],
    datasets: [
      {
        data: [recyclingPercentage, 100 - recyclingPercentage],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const barData = {
    labels: ['Total Waste Collected', 'Waste per Household', 'Collection Efficiency'],
    datasets: [
      {
        label: 'Waste Data',
        data: [totalWasteCollected, wastePerHousehold, collectionEfficiency],
        backgroundColor: ['#4BC0C0', '#FFCE56', '#E7E9ED'],
      },
    ],
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Admin Monitoring Report', 14, 10);
    doc.autoTable({
      head: [['Total Waste Collected', 'Waste per Household', 'Collection Efficiency', 'Recycling Percentage']],
      body: [[totalWasteCollected, wastePerHousehold, collectionEfficiency, recyclingPercentage]],
    });

    doc.text('Recent Requests:', 14, 60);
    recentRequests.forEach((req, idx) => {
      doc.text(`${idx + 1}. Request ID: ${req.requestId}, Status: ${req.status}`, 14, 70 + idx * 10);
    });

    doc.save('admin_report.pdf');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Monitoring Dashboard
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {/* Bar Chart */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Waste Data Overview
              </Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>
        {/* Pie Chart */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recycling Distribution
              </Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>
        {/* Recent Requests */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Waste Collection Requests
              </Typography>
              {recentRequests.map((req, index) => (
                <Typography key={index}>
                  {index + 1}. Request ID: {req.requestId}, Status: {req.status}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
        {/* Generate PDF Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Download Report
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminMonitoring;
