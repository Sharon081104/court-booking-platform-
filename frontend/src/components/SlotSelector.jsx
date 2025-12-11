import React, { useState, useEffect } from 'react';
import { fetchCourts } from '../services/apiService';

// Mock data for demonstration until API is fully wired
const MOCK_TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00',
];
const MOCK_COURTS = [
    { _id: 'c1', name: 'Tennis Court 1' },
    { _id: 'c2', name: 'Badminton Court 2' },
    { _id: 'c3', name: 'Squash Court 3' },
];

const SlotSelector = ({ onSelectSlot }) => {
    // State to store courts fetched from the backend
    const [courts, setCourts] = useState([MOCK_COURTS]);
    // State to track the user's current selection
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // useEffect to fetch courts when the component mounts
    useEffect(() => {
        const loadCourts = async () => {
            try {
                // Ensure the backend server is running for this API call to work
                const courtData = await fetchCourts();
                setCourts(courtData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load courts. Is the backend running?");
                setLoading(false);
            }
        };
        loadCourts();
    }, []);

    // Handler for when a user clicks a time slot/court combination
    const handleSlotClick = (courtId, time) => {
        const newSelection = { courtId, time, date: new Date().toISOString().split('T')[0] };
        setSelectedSlot(newSelection);
        // Pass the selection up to the parent component (BookingPage)
        onSelectSlot(newSelection); 
    };
   console.log('Courts loaded:', courts);
    if (loading) return <div className="text-center p-4">Loading courts...</div>;
    if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select a Court and Time</h2>
            
            {/* Display the court schedule grid */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            {courts.map((court) => (
                                <th key={court._id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {court.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {MOCK_TIME_SLOTS.map((time) => (
                            <tr key={time}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{time}</td>
                                {courts.map((court) => {
                                    const isSelected = selectedSlot && selectedSlot.courtId === court._id && selectedSlot.time === time;
                                    // Placeholder for actual availability check from backend
                                    const isAvailable = true; 

                                    return (
                                        <td 
                                            key={`${court._id}-${time}`}
                                            className={`px-6 py-4 whitespace-nowrap text-center text-sm cursor-pointer ${
                                                isSelected 
                                                    ? 'bg-blue-600 text-white font-bold border-2 border-blue-800'
                                                    : isAvailable 
                                                        ? 'bg-green-100 hover:bg-green-200 text-green-800'
                                                        : 'bg-red-100 text-red-500 cursor-not-allowed'
                                            }`}
                                            onClick={() => isAvailable && handleSlotClick(court._id, time)}
                                        >
                                            {isAvailable ? 'Available' : 'Booked'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SlotSelector;