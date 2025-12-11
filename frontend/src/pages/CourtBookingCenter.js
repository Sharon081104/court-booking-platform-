// C:\Users\Sharon\Documents\project assignment\root\frontend\src\pages\CourtBookingCenter.js

import React, { useState } from 'react';
import axios from 'axios';
// Assume SlotSelector and BookingSummary components are in '../components/'
import SlotSelector from '../components/SlotSelector'; 
import BookingSummary from '../components/BookingSummary'; 

const CourtBookingCenter = () => {
    // State to hold the user's selected slot (courtId, time, date)
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Handler passed to SlotSelector to update the state when a slot is clicked
    const handleSlotSelected = (slotData) => {
        // Includes courtId, time, and date
        setSelectedSlot(slotData);
    };

    // Handler for the final 'Book Now' button click
    const handleBookNow = async () => {
        if (!selectedSlot) return alert('Please select a court and time before booking.');
        
        try {
            // Send POST request to the new /api/bookings endpoint
            const response = await axios.post('/api/bookings', selectedSlot);

            alert('Booking confirmed! Reference: ' + response.data.bookingId);
            setSelectedSlot(null); // Clear selection after successful booking
            // Optional: Re-fetch courts to update availability
        } catch (error) {
            console.error('Booking error:', error.response?.data || error.message);
            alert('Booking failed. Error: ' + (error.response?.data?.message || 'Server connection issue.'));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl text-center mb-6 text-indigo-700">Court Booking Center</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Slot Selector (The Schedule Grid) */}
                <div className="lg:col-span-2">
                    {/* The onSelectSlot prop is what links the click handler in SlotSelector here */}
                    <SlotSelector 
                        onSelectSlot={handleSlotSelected} 
                        selectedSlot={selectedSlot}
                    />
                </div>
                
                {/* 2. Booking Summary & Book Now Button */}
                <div>
                    <BookingSummary 
                        selectedSlot={selectedSlot}
                        onBookNow={handleBookNow} // The final submission function
                    />
                </div>
            </div>
        </div>
    );
};

export default CourtBookingCenter;