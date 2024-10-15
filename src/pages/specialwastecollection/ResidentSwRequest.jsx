import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';

// Material UI imports
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const wasteCategories = [
  { id: 1, name: "Household Waste", baseCharge: 100 },
  { id: 2, name: "Recyclable Waste", baseCharge: 100 },
  { id: 3, name: "E-Waste", baseCharge: 250 },
  { id: 4, name: "Hazardous Waste", baseCharge: 400 },
  { id: 5, name: "Bulky Waste", baseCharge: 350 },
  { id: 6, name: "Green Waste", baseCharge: 200 },
  { id: 7, name: "Textile Waste", baseCharge: 150 },
  { id: 8, name: "Special Event Waste", baseCharge: 300 },
];

const ResidentSwRequest = () => {
  const [selectedCategories, setSelectedCategories] = useState([{ id: '', amount: 0 }]);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [location, setLocation] = useState('');
  const [totalCharge, setTotalCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [name, setName] = useState('');
  const [openTerms, setOpenTerms] = useState(false);

  const userId = '8oO1oaRzfEWFaHJaOCUk';

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setLocation(userData.address || '');
      } else {
        console.log('No such document!');
      }
    };

    fetchUserData();
  }, []);

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index][field] = value;
    setSelectedCategories(updatedCategories);
    calculateCharge(updatedCategories);
  };

  const addCategory = () => {
    setSelectedCategories([...selectedCategories, { id: '', amount: 0 }]);
  };

  const removeCategory = (index) => {
    const updatedCategories = selectedCategories.filter((_, i) => i !== index);
    setSelectedCategories(updatedCategories);
    calculateCharge(updatedCategories);
  };

  const calculateCharge = (categories) => {
    const charge = categories.reduce((total, category) => {
      const selectedCategory = wasteCategories.find(c => c.id === parseInt(category.id));
      return total + (selectedCategory ? selectedCategory.baseCharge * category.amount : 0);
    }, 0);
    setTotalCharge(charge);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }

    const hasInvalidAmount = selectedCategories.some(category => category.amount < 20);
    if (hasInvalidAmount) {
      alert('Each category must have an amount of at least 20 kg.');
      return;
    }

    const swCollectionRef = collection(db, 'Users', userId, 'SpecialWasteRequests');

    try {
      await addDoc(swCollectionRef, {
        selectedCategories,
        pickupDate,
        pickupTime,
        location,
        totalCharge,
        paymentMethod,
        termsAccepted,
        status: 'Pending',
        timestamp: new Date(),
        name,
      });

      alert('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request: ', error);
      alert('Failed to submit request');
    }
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center display-6 mb-4">Special Waste Collection Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {selectedCategories.map((category, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-6">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Waste Category</InputLabel>
                    <Select
                      value={category.id}
                      onChange={(e) => handleCategoryChange(index, 'id', e.target.value)}
                      label="Select Waste Category"
                      required
                    >
                      {wasteCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-4">
                  <TextField
                    type="number"
                    label="Amount (in kg)"
                    variant="outlined"
                    fullWidth
                    value={category.amount || ''}
                    onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-2 d-flex align-items-center">
                  {index > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeCategory(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button className="mb-4" variant="text" color="primary" onClick={addCategory}>
              + Add Another Category
            </Button>

            <div className="row mb-4">
              <div className="col-md-6">
                <TextField
                  type="date"
                  label="Pickup Date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <TextField
                  type="time"
                  label="Pickup Time"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <TextField
                label="Total Service Charge"
                variant="outlined"
                fullWidth
                value={`Rs.${totalCharge.toFixed(2)}`}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>

            <div className="mb-3">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                  required
                >
                  <MenuItem value="credit_card">Credit/Debit Card</MenuItem>
                  <MenuItem value="cash_on_pickup">Cash on pickup</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="mb-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                }
                label={
                  <span>
                    I agree to the{' '}
                    <span
                      style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={handleOpenTerms}
                    >
                      terms and conditions
                    </span>
                  </span>
                }
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              Submit Request
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={openTerms} onClose={handleCloseTerms}>
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <p>
            1. The user agrees to provide accurate information about the waste to be collected.
          </p>
          <p>
            2. The user must ensure that the waste is properly segregated according to the selected categories.
          </p>
          <p>
            3. The user agrees to pay the total service charge as calculated based on the selected waste categories and amounts.
          </p>
          <p>
            4. The collection service reserves the right to refuse collection if the waste does not match the description provided in the request.
          </p>
          <p>
            5. The user must be present at the specified location during the selected pickup time.
          </p>
          {/* Add more terms as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResidentSwRequest;