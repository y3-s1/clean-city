import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import confirmationAudio from '../../../assets/sounds/confirmation.mp3';

const QRScanner = () => {
  const [manualInput, setManualInput] = useState('');
  const [qrError, setQrError] = useState(false);
  const navigate = useNavigate();

  const handleManualSubmit = () => {
    if (manualInput) {
      navigate(`/collector/confirmationPage/${manualInput}`);
    }
  };

  const playConfirmationSound = () => {
    const audio = new Audio(confirmationAudio);
    audio.play();
  };

  useEffect(() => {
    // Configuration for the QR Scanner
    const config = {
      fps: 10, // Higher fps for faster scanning
      qrbox: { width: 250, height: 250 }, // Set a box in the middle of the video
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], // Only scan QR codes
      rememberLastUsedCamera: true, // Remember the camera that was used last time
      showTorchButtonIfSupported: true, // Add a flashlight button if supported
    };

    const html5QrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", config, false
    );

    html5QrCodeScanner.render(
      (decodedText) => {
        playConfirmationSound();
        navigate(`/collector/confirmationPage/${decodedText}`);
      },
      (errorMessage) => {
        console.error(errorMessage);
        setQrError(true);
      }
    );

    // Clean up the scanner when the component is unmounted
    return () => {
      html5QrCodeScanner.clear();
    };
  }, [navigate]);

  return (
    <div className="t-container t-mx-auto t-p-4">
      <h1 className="t-text-2xl t-font-bold t-mb-4">QR Code Scanner</h1>

      {/* QR Scanner */}
      <div id="qr-reader" className="t-bg-gray-100 t-p-4 t-rounded-lg t-shadow-md t-mb-6"></div>

      {qrError && (
        <p className="t-text-red-500 t-mt-2">
          Error scanning QR code. Please try again or enter the bin ID manually.
        </p>
      )}

      {/* Manual Bin ID Input */}
      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md">
        <p className="t-font-semibold">Can't scan the QR code? Enter the bin ID manually:</p>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Enter bin ID"
          className="t-px-4 t-py-2 t-mt-2 t-border t-border-gray-300 t-rounded-lg t-w-full"
        />
        <button
          onClick={handleManualSubmit}
          className="t-px-4 t-py-2 t-bg-green-600 t-text-white t-rounded-lg t-mt-4 t-w-full t-hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
