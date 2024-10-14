import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Firebase config
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material'; // Material-UI components

function AdminMonitoring() {
  const [totalWasteCollected, setTotalWasteCollected] = useState(0);
  const [wastePerHousehold, setWastePerHousehold] = useState(0);
  const [collectionEfficiency, setCollectionEfficiency] = useState(0);

  useEffect(() => {
    const fetchWasteData = async () => {
      const wasteCollectionRef = collection(db, 'WasteCollectionRequests');
      const completedQuery = query(wasteCollectionRef, where('status', '==', 'Completed'));

      const wasteSnapshot = await getDocs(completedQuery);
      let totalWaste = 0;
      let wasteGeneratedSum = 0;
      let actualWasteCollectedSum = 0;

      for (const doc of wasteSnapshot.docs) {
        const wasteRequest = doc.data();
        const binIDs = wasteRequest.binID;

        for (const binID of binIDs) {
          const binDocRef = collection(db, 'Bins');
          const binDocs = await getDocs(query(binDocRef, where('residentID', '==', wasteRequest.residentID)));

          binDocs.forEach((binDoc) => {
            const binData = binDoc.data();
            if (binData) {
              totalWaste += binData.currentLevel;
              wasteGeneratedSum += binData.currentLevel;
              actualWasteCollectedSum += binData.currentLevel;
            }
          });
        }
      }

      setTotalWasteCollected(totalWaste);
      const efficiency = (actualWasteCollectedSum / wasteGeneratedSum) * 100;
      setCollectionEfficiency(efficiency.toFixed(2));
    };

    fetchWasteData();
  }, []);

  useEffect(() => {
    const fetchWastePerHousehold = async () => {
      const usersRef = collection(db, 'Users');
      const userSnapshot = await getDocs(usersRef);

      let totalWasteGenerated = 0;
      let householdCount = 0;

      for (const userDoc of userSnapshot.docs) {
        const binDocRef = collection(db, 'Bins');
        const binDocs = await getDocs(query(binDocRef, where('residentID', '==', userDoc.id)));

        binDocs.forEach((binDoc) => {
          const binData = binDoc.data();
          if (binData.currentLevel) {
            totalWasteGenerated += binData.currentLevel;
          }
        });

        householdCount++;
      }

      const averageWaste = totalWasteGenerated / householdCount;
      setWastePerHousehold(averageWaste.toFixed(2));
    };

    fetchWastePerHousehold();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Monitoring Dashboard
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Total Waste Collected
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {totalWasteCollected} tons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Waste per Household
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {wastePerHousehold} tons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Collection Efficiency
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {collectionEfficiency}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminMonitoring;
