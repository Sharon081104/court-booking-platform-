// C:\...\frontend\src\services\bookingService.js

// --- Standardized Base URL ---
const API_BASE_URL = 'http://localhost:5000/api'; // Standardize the base URL to include /api

// --- 1. Fetch Courts ---
export const fetchCourts = async () => {
    // FIX: Use the correct API_BASE_URL
    const response = await fetch(`${API_BASE_URL}/courts`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch courts.');
    }
    return response.json();
};

// --- 2. Calculate Price (The Fix for the 404!) ---
// NOTE: This must be exported so the component can use it
export const calculatePrice = async (details) => { 
    // The fixed URL now correctly links to the route in bookingRoutes.js
    const response = await fetch(`${API_BASE_URL}/bookings/calculate-price`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
    });

    if (!response.ok) {
        // This handles both 404 and other backend failures gracefully
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        throw new Error('Price calculation failed.');
    }

    return response.json();
};

// --- 3. Create Booking ---
export const createBooking = async (bookingDetails) => {
    // FIX: Use the correct API_BASE_URL
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed due to a server error.');
    }
    return response.json();
};

// --- 4. Fetch Coaches ---
export const fetchCoaches = async () => {
    // FIX: Use the standardized API_BASE_URL
    const response = await fetch(`${API_BASE_URL}/coaches`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch coaches from API');
    }
    return response.json();
};