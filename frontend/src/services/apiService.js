import axios from 'axios';

// Set up the base URL for the backend API
const API = axios.create({
    // Use the port where your Node/Express server is running (usually 5000)
    baseURL: 'https://court-booking-platform-5qux.onrender.com/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch all available courts for the Slot Selector
export const fetchCourts = async () => {
    try {
        const response = await API.get('/courts');
        return response.data;
    } catch (error) {
        console.error("Error fetching courts:", error);
        throw error;
    }
};

// Function to get the dynamic price for a potential booking (Phase 4 Logic)
export const checkPrice = async (bookingDetails) => {
    try {
       const response = await API.post('/bookings/price', bookingDetails);
        return response.data.finalPrice;
    } catch (error) {
        console.error("Error checking price:", error);
        throw error;
    }
};
export const createBooking = async (bookingData) => {
    try {
        // Sends the full client and slot details to the backend
        const response = await API.post('/bookings', bookingData);
        return response.data; // Returns { message, bookingId, finalPrice }
    } catch (error) {
        console.error("Error creating booking:", error.response.data.message);
        // Throw the error message for the form to display
        throw new Error(error.response.data.message || "Could not finalize booking.");
    }
};

// ... existing functions (fetchCourts, checkPrice, createBooking) ...

// NEW: Function to get all bookings for the Admin Dashboard
export const getAllBookings = async () => {
    try {
        const response = await API.get('/bookings/admin');
        return response.data;
    } catch (error) {
        console.error("Error fetching all bookings:", error.response.data.message);
        throw new Error("Could not load bookings list.");
    }
};