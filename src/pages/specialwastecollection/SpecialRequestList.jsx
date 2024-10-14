import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
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
  pending: 'text-primary',
  accepted: 'text-success',
  cancelled: 'text-danger',
};

const SpecialRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // Filter state
  const [searchTerm, setSearchTerm] = useState(''); // Search state

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

  const handleDelete = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'Users', userId, 'SpecialWasteRequests', requestId));
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Filter requests based on selected filter and search term
  const filteredRequests = requests
    .filter(request => 
      (filter === 'all' || request.status.toLowerCase() === filter) &&
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by location
    );

  return (
    <div className="container">
      <h1 className="display-6 mb-4 mt-3">Collection Request List</h1>

      {/* Filter and search bar */}
      <div className="d-flex justify-content-end mb-4">
        <input
          type="text"
          className="form-control me-2 w-50" // Set width for the search bar and space between buttons
          placeholder="Search by address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto" // Set width to auto for the filter
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="row">
          {filteredRequests.map((request) => (
            <div className="col-12 mb-4" key={request.id}>
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
                        {categoryMap[cat.id] || 'Unknown Category'} (Amount: {cat.amount} kg)
                        {request.selectedCategories.length - 1 !== cat.id && ', '}
                      </span>
                    ))} <br />
                  </p>
                </div>
                <div className={`card-footer ${statusStyles[request.status.toLowerCase()]}`}>
                  <strong>Status:</strong> {request.status}
                  {/* Delete button: only show if status is pending or cancelled */}
                  {['pending', 'cancelled'].includes(request.status.toLowerCase()) && (
                    <button 
                      className="btn btn-danger float-end" 
                      onClick={() => handleDelete(request.id)}
                    >
                      Delete
                    </button>
                  )}
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
