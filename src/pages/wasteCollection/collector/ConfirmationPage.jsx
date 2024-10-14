import React from 'react';
import { useParams } from 'react-router-dom';

const ConfirmationPage = () => {
  const { decodedText } = useParams();

  return (
    <div className="t-container t-mx-auto t-p-4">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Confirmation Page</h1>
      <p className="t-text-lg">Scanned QR Code:</p>
      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mt-2">
        <p className="t-text-gray-800">{decodedText}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
