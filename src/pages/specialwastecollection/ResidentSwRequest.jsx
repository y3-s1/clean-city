import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';

const wasteCategories = [
  { id: 1, name: "Household Waste", baseCharge: 20 },
  { id: 2, name: "Recyclable Waste", baseCharge: 15 },
  { id: 3, name: "E-Waste", baseCharge: 25 },
  { id: 4, name: "Hazardous Waste", baseCharge: 40 },
  { id: 5, name: "Bulky Waste", baseCharge: 35 },
  { id: 6, name: "Green Waste", baseCharge: 20 },
  { id: 7, name: "Textile Waste", baseCharge: 15 },
  { id: 8, name: "Special Event Waste", baseCharge: 30 },
];

const ResidentSwRequest = () => {
  const [selectedCategories, setSelectedCategories] = useState([{ id: '', amount: 0 }]);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [location, setLocation] = useState('');
  const [totalCharge, setTotalCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [name, setName] = useState(''); // New state for name

  const userId = '8oO1oaRzfEWFaHJaOCUk'; // Fixed user ID

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || ''); // Set name from user data
        setLocation(userData.address || ''); // Set address from user data
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
        status: 'Pending', // Fixed value for status
        timestamp: new Date(),
        name, // Include name in the document
      });

      alert('Request submitted successfully!');
      // Reset form fields if needed
    } catch (error) {
      console.error('Error submitting request: ', error);
      alert('Failed to submit request');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Special Waste Collection Request</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {selectedCategories.map((category, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col-md-5">
                        <select
                          className="form-select"
                          value={category.id}
                          onChange={(e) => handleCategoryChange(index, 'id', e.target.value)}
                          required
                        >
                          <option value="">Select Waste Category</option>
                          {wasteCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-5">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Amount (in kg)"
                          value={category.amount}
                          onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        {index > 0 && (
                          <button type="button" className="btn btn-danger" onClick={() => removeCategory(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mb-3">
                  <button type="button" className="btn btn-secondary" onClick={addCategory}>
                    Add Another Category
                  </button>
                </div>

                <div className="mb-3">
                  <label htmlFor="pickupDate" className="form-label">Pickup Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="pickupDate"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="pickupTime" className="form-label">Pickup Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    id="pickupTime"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="totalCharge" className="form-label">Total Service Charge:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="totalCharge"
                    value={`Rs.${totalCharge.toFixed(2)}`}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="paymentMethod" className="form-label">Payment Method:</label>
                  <select
                    className="form-select"
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="cash_on_pickup">Cash on pickup</option>
                  </select>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I accept the <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms and conditions document'); }}>terms and conditions</a>
                  </label>
                </div>
                
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={!termsAccepted}>
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentSwRequest;
