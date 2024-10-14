import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

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

const SpecialRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Collection Request List</h1>
      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <strong>Location:</strong> {request.location} <br />
              <strong>Pickup Date:</strong> {request.pickupDate} <br />
              <strong>Pickup Time:</strong> {request.pickupTime} <br />
              <strong>Total Charge:</strong> Rs.{request.totalCharge.toFixed(2)} <br />
              <strong>Payment Method:</strong> {request.paymentMethod} <br />
              <strong>Status:</strong> {request.status} <br />
              <strong>Categories:</strong> {request.selectedCategories.map(cat => (
                <span key={cat.id}>
                  {categoryMap[cat.id] || `Unknown Category`} (Amount: {cat.amount} kg)
                  {request.selectedCategories.length - 1 !== cat.id && ', '}
                </span>
              ))} <br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpecialRequestList;
