import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { FaTrash } from "react-icons/fa6";
import QRCode from 'react-qr-code';
import Modal from 'react-modal';

const MyQRCodes = () => {
  const userDocumentID = '8oO1oaRzfEWFaHJaOCUk';
  const [myBinIDs, setMyBinIDs] = useState([]);
  const [myBins, setMyBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchUserBins = async () => {
    try {
      const userDocRef = doc(db, 'Users', userDocumentID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setMyBinIDs(userData.bins || []);
      } else {
        setError('No such document!');
      }
    } catch (err) {
      console.error('Error fetching user bins:', err);
      setError('Failed to load bin IDs');
    }
  };

  const fetchBins = async () => {
    try {
      const binsCollectionRef = collection(db, 'Bins');
      const binsSnapshot = await getDocs(binsCollectionRef);

      const binsList = binsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyBins(binsList);
    } catch (err) {
      console.error('Error fetching bins:', err);
      setError('Failed to load bin objects');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserBins();
      await fetchBins();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleQRClick = (binID) => {
    setSelectedQR(binID);
  };

  const closeModal = () => {
    setSelectedQR(null);
  };

  const handleDownload = () => {
    if (selectedQR) {
      const qrCodeCanvas = document.querySelector('.modal-qrcode canvas');
  
      if (qrCodeCanvas) {
        const link = document.createElement('a');
        link.href = qrCodeCanvas.toDataURL('image/png');
        link.download = `${selectedQR}.png`;
        link.click();
      }
    }
  };
  

  return (
    <div className="t-container t-mx-auto t-p-4">
      <h2 className="t-text-2xl t-font-bold t-mb-4">My Bins</h2>

      <ul className="t-list-none">
        {myBins.map((bin) => (
          <li key={bin.id} className="t-flex t-items-center t-mb-4 t-py-2 t-border-b t-border-gray-300">
            <FaTrash
              className={
                bin.binType === 'Organic'
                  ? 't-text-green-600 t-text-3xl t-mr-4'
                  : bin.binType === 'Polythene'
                  ? 't-text-red-500 t-text-3xl t-mr-4'
                  : 't-text-black t-text-3xl t-mr-4'
              }
            />
            <div className="t-ml-4">
              <span className="t-font-semibold">Type: </span><span>{bin.binType}</span><br />
              <span className='t-text-xs'>ID : {bin.id}</span>
            </div>

            <div className="t-ml-auto">
              <div
                className="t-cursor-pointer"
                onClick={() => handleQRClick(bin.id)}
              >
                <QRCode
                  value={bin.id}
                  size={64}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for displaying full QR code */}
      <Modal
        isOpen={!!selectedQR}
        onRequestClose={closeModal}
        className="t-bg-white t-rounded-lg t-p-8 t-shadow-lg t-mx-auto t-my-auto"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div className="t-flex t-flex-col t-items-center">
          <h2 className="t-text-2xl t-font-bold t-mb-4">Bin QR Code</h2>
          {selectedQR && (
            <div className="modal-qrcode">
              <QRCode
                value={selectedQR}
                size={256}
              />
            </div>
          )}
          <div className='t-flex t-gap-10'>
            <button
              className="t-mt-6 t-bg-green-600 t-text-white t-px-4 t-py-2 t-rounded-lg t-hover:bg-blue-600"
              onClick={handleDownload}
            >
              Download
            </button>
            <button
              className="t-mt-6 t-bg-blue-500 t-px-8 t-text-white t-px-4 t-py-2 t-rounded-lg t-hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyQRCodes;
