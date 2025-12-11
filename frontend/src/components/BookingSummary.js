// C:\Users\Sharon\Documents\project assignment\root\frontend\src\components\BookingSummary.js

import React from 'react';

const BookingSummary = ({ selectedSlot, onBookNow }) => {
    // Simple placeholder for court name; should ideally fetch the name based on courtId
    const courtDisplay = selectedSlot ? `Court ID: ${selectedSlot.courtId}` : ''; 
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-xl sticky top-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Booking Summary</h2>
            
            {selectedSlot ? (
                <div className="space-y-3">
                    <p><strong>Court:</strong> {courtDisplay}</p>
                    <p><strong>Time:</strong> {selectedSlot.time}</p>
                    <p><strong>Date:</strong> {selectedSlot.date || new Date().toLocaleDateString()}</p>
                    
                    <button
                        onClick={onBookNow}
                        className="w-full py-3 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold transition duration-200"
                    >
                        Book Now
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">Please select an available slot above.</p>
            )}
        </div>
    );
};

export default BookingSummary;