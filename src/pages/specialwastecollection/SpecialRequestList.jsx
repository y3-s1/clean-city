import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
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

const statusStyles = {
  pending: 'text-primary',    // Bootstrap class for blue
  accepted: 'text-success',    // Bootstrap class for green
  cancelled: 'text-danger',     // Bootstrap class for light red
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
    <div className="container">
      <h1 className="my-4">Collection Request List</h1>
      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="row">
          {requests.map((request) => (
            <div className="col-md-4 mb-4" key={request.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Location: {request.location}</h5>
                  <p className="card-text">
                    <strong>Pickup Date:</strong> {request.pickupDate} <br />
                    <strong>Pickup Time:</strong> {request.pickupTime} <br />
                    <strong>Total Charge:</strong> Rs.{request.totalCharge.toFixed(2)} <br />
                    <strong>Payment Method:</strong> {request.paymentMethod} <br />
                    <strong>Categories:</strong> {request.selectedCategories.map(cat => (
                      <span key={cat.id}>
                        {categoryMap[cat.id] || `Unknown Category`} (Amount: {cat.amount} kg)
                        {request.selectedCategories.length - 1 !== cat.id && ', '}
                      </span>
                    ))} <br />
                  </p>
                </div>
                <div className={`card-footer ${statusStyles[request.status.toLowerCase()]}`}>
                  <strong>Status:</strong> {request.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialRequestList;
