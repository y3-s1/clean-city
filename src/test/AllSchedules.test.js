import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AllSchedules from "../test/AllSchedules.test";
import '@testing-library/jest-dom/extend-expect'; // Provides custom matchers for Jest

// Mocking Firebase Firestore
jest.mock('../../firebase/firebase', () => ({
  db: jest.fn()
}));

// Mocking Google Maps LoadScript and Map
jest.mock("@react-google-maps/api", () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children }) => <div>{children}</div>,
  DirectionsRenderer: () => <div data-testid="directions-renderer"></div>,
  Polyline: () => <div data-testid="polyline"></div>,
}));

describe('AllSchedules Page', () => {
  test('renders Waste Collection Schedules title', () => {
    render(<AllSchedules />);
    const titleElement = screen.getByText(/Waste Collection Schedules/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders map', () => {
    render(<AllSchedules />);
    const mapElement = screen.getByTestId('google-map');
    expect(mapElement).toBeInTheDocument();
  });

  test('shows a schedule after selection', async () => {
    const { getByText, queryByText } = render(<AllSchedules />);

    // Initially no schedule selected
    expect(queryByText(/Truck ID:/i)).toBeNull();

    // Simulate selecting a schedule (mock data could be used)
    fireEvent.click(getByText(/View Truck/i));

    // After selection, schedule details should appear
    expect(getByText(/Truck ID:/i)).toBeInTheDocument();
  });
});
