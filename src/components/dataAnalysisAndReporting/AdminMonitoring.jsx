import React, { useEffect, useState } from "react";
import wasteCollectionRequestsDummyData from "../../data/wasteCollectionRequestsDummyData.json";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Firebase config
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2"; // Use react-chartjs-2 for rendering charts
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table generation in jsPDF
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
      const wasteCollectionRef = collection(db, "WasteCollectionRequests");
      const completedQuery = query(
        wasteCollectionRef,
        where("status", "==", "Completed")
      );
      let wasteSnapshot = await getDocs(completedQuery);
      wasteSnapshot = wasteCollectionRequestsDummyData.WasteCollectionRequests;
      let totalWaste = 0;
      let actualWasteCollectedSum = 0;
      let recycledWasteSum = 0;

      for (const wasteRequest of wasteSnapshot) {
        if (wasteRequest.status === "Completed") {
          totalWaste += wasteRequest.totalWaste || 0;
          actualWasteCollectedSum += wasteRequest.collectedWaste || 0;
          recycledWasteSum += wasteRequest.recycledWaste || 0;
        }
      }

      setTotalWasteCollected(totalWaste);
      setCollectionEfficiency(
        ((actualWasteCollectedSum / totalWaste) * 100).toFixed(2)
      );
      setRecyclingPercentage(
        ((recycledWasteSum / totalWaste) * 100).toFixed(2)
      );
    };

    const fetchRecentRequests = async () => {
      const wasteCollectionRef = collection(db, "WasteCollectionRequests");
      const wasteSnapshot = await getDocs(wasteCollectionRef);
      const recentRequestsData = wasteSnapshot.docs
        .slice(0, 5)
        .map((doc) => doc.data());
      setRecentRequests(recentRequestsData);
    };

    fetchWasteData();
    fetchRecentRequests();
  }, []);

  const pieData = {
    labels: ["Recycled Waste", "Non-Recycled Waste"],
    datasets: [
      {
        data: [recyclingPercentage, 100 - recyclingPercentage],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const barData = {
    labels: [
      "Total Waste Collected",
      "Waste per Household",
      "Collection Efficiency",
    ],
    datasets: [
      {
        label: "Waste Data",
        data: [totalWasteCollected, wastePerHousehold, collectionEfficiency],
        backgroundColor: ["#4BC0C0", "#FFCE56", "#E7E9ED"],
      },
    ],
  };

  const areaData = {
    labels: ["Area 1", "Area 2", "Area 3", "Area 4"],
    datasets: [
      {
        label: "Waste Collected (tons)",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: [30, 45, 20, 60], // Example waste data for each area
      },
    ],
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Monitoring Report", 14, 10);
    doc.autoTable({
      head: [
        [
          "Total Waste Collected",
          "Waste per Household",
          "Collection Efficiency",
          "Recycling Percentage",
        ],
      ],
      body: [
        [
          totalWasteCollected,
          wastePerHousehold,
          collectionEfficiency,
          recyclingPercentage,
        ],
      ],
    });

    doc.text("Recent Requests:", 14, 60);
    recentRequests.forEach((req, idx) => {
      doc.text(
        `${idx + 1}. Request ID: ${req.requestId}, Status: ${req.status}`,
        14,
        70 + idx * 10
      );
    });

    doc.save("admin_report.pdf");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Monitoring Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Monitor waste collection performance, recycling stats, and recent
          requests.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Waste Data Overview
              </Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart with smaller size */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recycling Distribution
              </Typography>
              <Box sx={{ width: "60%", margin: "auto" }}>
                {" "}
                {/* Adjust the size of the Pie chart */}
                <Pie data={pieData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* New Bar Chart: Waste Collection Levels by Area - Below */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Waste Collection Levels by Area
              </Typography>
              <Bar data={areaData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Waste Collection Requests
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentRequests.map((req, index) => (
                  <Typography key={index}>
                    {index + 1}. Request ID: {req.requestId}, Status:{" "}
                    {req.status}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Generate PDF Button */}
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: 4 }}>
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Download Report
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminMonitoring;
