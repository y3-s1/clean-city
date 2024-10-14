import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { TextField, Button, Autocomplete, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import '../../css/admin.css';

function AddTruck() {
  const [truckName, setTruckName] = useState('');
  const [registeredNumber, setRegisteredNumber] = useState('');
  const [collectorId, setCollectorId] = useState([]); // Stores selected collector IDs
  const [collectors, setCollectors] = useState([]);   // Stores list of collectors from Firestore

  // Fetch collectors from Firestore when the component mounts
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'collector'));
        const collectorsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // collectorId
          name: doc.data().collectorName, // collectorName
        }));
        setCollectors(collectorsData);
      } catch (error) {
        console.error('Error fetching collectors: ', error);
      }
    };

    fetchCollectors();
  }, []);

  // Handler to add truck data to Firebase
  const handleAddTruck = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'trucks'), {
        truckName,
        registeredNumber,
        collectorId, // Send selected collector IDs to Firestore
      });

      // Reset form fields
      setTruckName('');
      setRegisteredNumber('');
      setCollectorId([]);
      alert('Truck added successfully!');
    } catch (error) {
      console.error('Error adding truck: ', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 600,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#37474f',
            textTransform: 'uppercase',
          }}
        >
          Add New Truck
        </Typography>

        <form onSubmit={handleAddTruck}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Truck Name"
              variant="outlined"
              fullWidth
              value={truckName}
              onChange={(e) => setTruckName(e.target.value)}
              required
              sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f9f9f9',
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#37474f',
                  },
                },
              }}
            />
            <TextField
              label="Registered Number"
              variant="outlined"
              fullWidth
              value={registeredNumber}
              onChange={(e) => setRegisteredNumber(e.target.value)}
              required
              sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f9f9f9',
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#37474f',
                  },
                },
              }}
            />
            <Autocomplete
              multiple
              options={collectors}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setCollectorId(newValue.map((collector) => collector.id)); // Store selected collector IDs
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Collectors"
                  placeholder="Search Collectors"
                  sx={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: '#bdbdbd',
                    },
                    '&:hover fieldset': {
                      borderColor: '#37474f',
                    },
                  }}
                />
              )}
              fullWidth
              sx={{
                marginBottom: 2,
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: 2,
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: '#00796b',
              '&:hover': {
                backgroundColor: '#004d40',
              },
              transition: 'background-color 0.3s ease',
            }}
          >
            Add Truck
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default AddTruck;
