import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WasteLevelMonitoring from './WasteLevelMonitoring';
import { db } from '../../firebase/firebase';
import { onSnapshot, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn().mockReturnValue({}),
}));

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: jest.fn().mockReturnValue({ isLoaded: true }),
  GoogleMap: jest.fn().mockReturnValue(<div data-testid="google-map"></div>),
  Marker: jest.fn().mockReturnValue(null),
}));

describe('WasteLevelMonitoring Component', () => {

  // Basic render test
  test('renders waste level monitoring dashboard', () => {
    render(<WasteLevelMonitoring />);
    const heading = screen.getByText(/Waste Level Monitoring Dashboard/i);
    expect(heading).toBeInTheDocument();
  });

  // Test for bins rendering
  test('displays bins correctly', async () => {
    // Mock bin data
    const binData = [
      { id: '1', binType: 'Polythin', currentLevel: 50, binHealth: 'Good', lastCollected: null },
      { id: '2', binType: 'Plastic', currentLevel: 80, binHealth: 'Fair', lastCollected: { seconds: 1638316800 } }
    ];

    onSnapshot.mockImplementationOnce((_, callback) => callback({
      forEach: (fn) => binData.forEach(fn),
    }));

    render(<WasteLevelMonitoring />);

    await waitFor(() => {
      expect(screen.getByText(/Bin Type: Polythin/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Level: 50%/i)).toBeInTheDocument();
      expect(screen.getByText(/Bin Type: Plastic/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Level: 80%/i)).toBeInTheDocument();
    });
  });

  // Test for alert threshold change
  test('changes alert threshold', () => {
    render(<WasteLevelMonitoring />);
    const input = screen.getByLabelText(/Set Custom Alert Threshold/i);
    fireEvent.change(input, { target: { value: '80' } });
    expect(input.value).toBe('80');
  });

  // Test for handling add bin action
  test('adds a new bin', async () => {
    addDoc.mockResolvedValue({ id: 'newBinId' });
    updateDoc.mockResolvedValue();
    
    render(<WasteLevelMonitoring />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Select Bin Type/i), { target: { value: 'Glass' } });
    
    const addButton = screen.getByText(/Add Bin/i);
    
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/New bin added successfully/i)).toBeInTheDocument();
    });
  });

  // Test for submitting a waste collection request
  test('submits waste collection request', async () => {
    addDoc.mockResolvedValue();

    render(<WasteLevelMonitoring />);

    const requestButton = screen.getByText(/Request Collection/i);
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        binID: expect.any(Array),
        collectorID: '',
        createdAt: expect.any(Object),
        residentID: 'S7xvf9vzXhvpdrxSEdgQ',
        routeAssigned: '',
        scheduledTime: '',
        status: 'Pending',
        updatedAt: expect.any(Object),
      });
    });
  });

  // Test for deleting a request
  test('deletes waste collection request', async () => {
    deleteDoc.mockResolvedValue();

    // Mock collection requests
    const collectionRequests = [
      { id: '1', binID: 'bin1', status: 'Pending', scheduledTime: '', collectorID: '' },
    ];
    
    onSnapshot.mockImplementation((query, callback) => {
      if (query.path.includes('WasteCollectionRequests')) {
        callback({
          forEach: (fn) => collectionRequests.forEach(fn),
        });
      }
    });

    render(<WasteLevelMonitoring />);

    // Click delete button
    const deleteButton = screen.getByText(/Delete Request/i);
    fireEvent.click(deleteButton);

    // Simulate confirmation dialog
    window.confirm = jest.fn(() => true);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });

  // Test for Google Map rendering
  test('renders google map', () => {
    render(<WasteLevelMonitoring />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });
});
