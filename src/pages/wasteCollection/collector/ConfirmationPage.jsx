import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ConfirmationPage = () => {
  const { decodedText } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updateBinLevel = async () => {
      try {
        // Reference to the specific bin document in the "Bins" collection
        const binRef = doc(db, 'Bins', decodedText);

        // Update the "currentLevel" attribute to 0
        await updateDoc(binRef, {
          currentLevel: 0,
        });

        console.log(`Bin ${decodedText} updated successfully.`);

        // Navigate to the 'todaySchedule' page after a 2-second delay
        setTimeout(() => {
          navigate('/collector/todaySchedule');
        }, 2000);
      } catch (error) {
        console.error('Error updating bin level:', error);
      }
    };

    if (decodedText) {
      updateBinLevel();
    }
  }, [decodedText, navigate]);

  return (
    <div className="t-container t-mx-auto t-p-4">
      <h1 className="t-text-2xl t-font-bold t-mb-4">Confirmation Page</h1>
      <p className="t-text-lg">Collected Successfully</p>
      <div className="t-bg-white t-p-4 t-rounded-lg t-shadow-md t-mt-2">
        <p className="t-text-gray-800">bin ID: {decodedText}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
