import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewStaff from "../test/ViewStaff.test";
import "@testing-library/jest-dom/extend-expect"; // Provides custom matchers for Jest
import { collection, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Mock Firebase Firestore

// Mock Firebase Firestore operations
jest.mock("../../firebase/firebase", () => ({
  db: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe("ViewStaff Page", () => {
  // Mock data for trucks and collectors
  const mockTrucks = [
    {
      id: "truck1",
      registeredNumber: "AB123",
      truckName: "Big Truck",
      collectorId: ["collector1"],
      collectors: [
        { collectorName: "John Doe", collectorEmail: "john@example.com" },
      ],
    },
    {
      id: "truck2",
      registeredNumber: "XY789",
      truckName: "Small Truck",
      collectorId: ["collector2"],
      collectors: [
        { collectorName: "Jane Doe", collectorEmail: "jane@example.com" },
      ],
    },
  ];

  const mockCollectors = [
    { collectorName: "John Doe", collectorEmail: "john@example.com" },
    { collectorName: "Jane Doe", collectorEmail: "jane@example.com" },
  ];

  beforeEach(() => {
    getDocs.mockResolvedValueOnce({
      docs: mockTrucks.map((truck) => ({
        id: truck.id,
        data: () => truck,
      })),
    });

    getDoc.mockImplementation((docRef) => {
      const id = docRef.id;
      if (id === "collector1") {
        return Promise.resolve({ exists: true, data: () => mockCollectors[0] });
      } else if (id === "collector2") {
        return Promise.resolve({ exists: true, data: () => mockCollectors[1] });
      }
      return Promise.resolve({ exists: false });
    });
  });

  test("renders trucks and collectors correctly", async () => {
    render(<ViewStaff />);

    // Expect CircularProgress to appear initially (loading state)
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for the trucks and collectors to load
    await waitFor(() => {
      expect(screen.getByText(/Truck ID: truck1/i)).toBeInTheDocument();
      expect(screen.getByText(/Truck ID: truck2/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });
  });

  test("allows editing a truck", async () => {
    render(<ViewStaff />);

    await waitFor(() => {
      expect(screen.getByText(/Truck ID: truck1/i)).toBeInTheDocument();
    });

    // Click the "Edit" button for truck1
    fireEvent.click(screen.getAllByText(/Edit/i)[0]);

    // Expect the input fields to appear
    const truckModelInput = screen.getByLabelText(/Truck Model/i);
    const truckCapacityInput = screen.getByLabelText(/Truck Capacity/i);

    fireEvent.change(truckModelInput, { target: { value: "Updated Model" } });
    fireEvent.change(truckCapacityInput, { target: { value: "Updated Capacity" } });

    // Click the "Save Changes" button
    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        registeredNumber: "Updated Model",
        truckName: "Updated Capacity",
      });
    });
  });

  test("allows deleting a truck", async () => {
    render(<ViewStaff />);

    await waitFor(() => {
      expect(screen.getByText(/Truck ID: truck1/i)).toBeInTheDocument();
    });

    // Click the "Delete" button for truck1
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Confirm the delete action in the test case
    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
    });

    // Check if the truck was removed from the UI
    expect(screen.queryByText(/Truck ID: truck1/i)).not.toBeInTheDocument();
  });
});
