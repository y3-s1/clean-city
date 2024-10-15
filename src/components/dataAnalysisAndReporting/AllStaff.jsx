import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Firebase configuration
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Include updateDoc and deleteDoc

import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Box,
  Button,
  TextField,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

function ViewStaff() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTruck, setEditTruck] = useState(null); // Track which truck is being edited
  const [updatedData, setUpdatedData] = useState({
    registeredNumber: "",
    truckName: "",
  });

  // Fetch truck and collector details from Firebase
  useEffect(() => {
    const fetchTruckDetails = async () => {
      try {
        const truckCollectionRef = collection(db, "trucks"); // Correct syntax for collection reference
        const truckSnapshot = await getDocs(truckCollectionRef);
        const truckData = [];

        // Loop through each truck document
        for (const truckDoc of truckSnapshot.docs) {
          const truck = truckDoc.data();
          truck.id = truckDoc.id;

          // Fetch associated collectors based on collectorId array
          const collectorPromises = truck.collectorId.map(async (id) => {
            try {
              const collectorDocRef = doc(db, "collector", id); // Correct syntax for doc reference
              const collectorDoc = await getDoc(collectorDocRef);
              const collector = collectorDoc.data();
              if (collectorDoc.exists()) {
                return collectorDoc.data();
              } else {
                console.warn(`Collector with ID ${id} not found`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching collector with ID ${id}:`, error);
              return null; // Return null in case of error
            }
          });

          // Wait for all collectors to be fetched
          const collectors = await Promise.all(collectorPromises);
          truck.collectors = collectors.filter(
            (collector) => collector !== null
          ); // Filter out null collectors
          truckData.push(truck); // Add truck with collector details to truckData
        }

        setTrucks(truckData); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching truck and collector data:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchTruckDetails();
  }, []);

  // Update truck data in Firebase
  const handleUpdateTruck = async (truckId) => {
    try {
      const truckDocRef = doc(db, "trucks", truckId);
      await updateDoc(truckDocRef, updatedData); // Update the truck data
      setEditTruck(null); // Exit edit mode after update
      setUpdatedData({ registeredNumber: "", truckName: "" }); // Clear input fields
    } catch (error) {
      console.error("Error updating truck:", error);
    }
  };

  // Delete truck from Firebase
  const handleDeleteTruck = async (truckId) => {
    try {
      const truckDocRef = doc(db, "trucks", truckId);
      await deleteDoc(truckDocRef); // Delete the truck
      setTrucks(trucks.filter((truck) => truck.id !== truckId)); // Remove truck from local state
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom align="center">
        Truck and Collector Details
      </Typography>
      <Grid container spacing={4}>
        {trucks.map((truck) => (
          <Grid item xs={12} md={6} key={truck.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalShippingIcon fontSize="large" />
                  <Typography variant="h6" component="div" ml={2}>
                    Truck ID: {truck.id}
                  </Typography>
                </Box>
                {editTruck === truck.id ? (
                  <Box>
                    <TextField
                      label="Truck Model"
                      value={updatedData.registeredNumber}
                      onChange={(e) =>
                        setUpdatedData({
                          ...updatedData,
                          registeredNumber: e.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Truck Capacity (tons)"
                      value={updatedData.truckName}
                      onChange={(e) =>
                        setUpdatedData({
                          ...updatedData,
                          truckName: e.target.value,
                        })
                      }
                      fullWidth
                      style={{ marginTop: 10 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateTruck(truck.id)}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => setEditTruck(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" gutterBottom>
                      <strong>Truck Model:</strong> {truck.registeredNumber}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Truck Capacity:</strong> {truck.truckName} tons
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setEditTruck(truck.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteTruck(truck.id)}
                      style={{ marginLeft: 10 }}
                    >
                      Delete
                    </Button>
                  </>
                )}

                <Typography variant="h6" component="div" mt={2}>
                  Assigned Collectors:
                </Typography>
                <List>
                  {truck.collectors.length > 0 ? (
                    truck.collectors.map((collector, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <strong>Name:</strong> + collector.collectorName
                          }
                          secondary={
                            <span>
                              <EmailIcon fontSize="small" />{" "}
                              {collector.collectorEmail}
                            </span>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2">
                      No collector data available
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ViewStaff;
