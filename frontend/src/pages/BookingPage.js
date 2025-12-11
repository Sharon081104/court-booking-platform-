import React, { useState, useEffect } from 'react';
import { fetchCourts, fetchCoaches, calculatePrice, createBooking } from '../services/bookingService'; 

const initialBookingState = {
    // Initialize date to today in YYYY-MM-DD format
    date: new Date().toISOString().split('T')[0],
    courtId: '',
    startTime: '10:00',
    endTime: '11:00',
    coachId: '',
    rackets: 0,
    shoes: 0,
};

function BookingPage() {
    const [booking, setBooking] = useState(initialBookingState);
    const [courts, setCourts] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [priceBreakdown, setPriceBreakdown] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // --- 1. Fetch Initial Data (Courts & Coaches) ---
    useEffect(() => {
        fetchCourts().then(setCourts).catch(console.error);

        fetchCoaches()
            .then(data => {
                setCoaches(data);
            })
            .catch(err => console.error("Error fetching coaches:", err));
        
    }, []);

    // --- 2. Live Price Calculation Hook ---
    useEffect(() => {
        // Only trigger calculation if necessary fields are set
        if (booking.courtId && booking.startTime && booking.endTime) {
            setLoading(true);
            const bookingDetails = {
                courtId: booking.courtId,
                // Correct date formatting for the backend API
                start: `${booking.date}T${booking.startTime}:00`,
                end: `${booking.date}T${booking.endTime}:00`,
                coachId: booking.coachId,
                requestedResources: { rackets: booking.rackets, shoes: booking.shoes },
            };
            
            calculatePrice(bookingDetails)
                .then(data => {
                    setPriceBreakdown(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Pricing Error:", err);
                    setPriceBreakdown(null);
                    setError("Could not calculate price. Check backend logs for API errors."); 
                })
                .finally(() => setLoading(false));
        } else {
            setPriceBreakdown(null);
        }
    }, [booking]); // Recalculate whenever booking state changes

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setBooking(prev => ({
            ...prev,
            // Convert to number only if the type attribute is set to 'number' in JSX
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    // --- 3. Submission Handler (Includes all necessary fixes) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // CRITICAL VALIDATION CHECK (Prevents "Invalid Date" CastError)
        if (!booking.date || !booking.courtId || !booking.startTime || !booking.endTime) {
            setError('Please fill in all required date, time, and court fields.');
            setLoading(false);
            return;
        }

        // CRITICAL PRICE CHECK (Prevents "priceDetails is required" ValidationError)
        if (!priceBreakdown) {
            setError('Price must be calculated before booking.');
            setLoading(false);
            return;
        }
        
        try {
            // 1. Prepare the full booking data
            const baseDetails = {
                ...booking,
                start: `${booking.date}T${booking.startTime}:00`, 
                end: `${booking.date}T${booking.endTime}:00`,
                requestedResources: { rackets: booking.rackets, shoes: booking.shoes },
                
                // FIX: Includes the required priceDetails
                priceDetails: priceBreakdown, 
                
                userId: "60c72b1f9c8d1d0015b4c10a" // Placeholder
            };

            // 2. Handle Coach ID Fix (Prevents Cast to ObjectId failed for value "")
            const bookingDetailsToSend = { ...baseDetails };
            
            if (bookingDetailsToSend.coachId === "") {
                // Delete the field entirely so Mongoose ignores it, rather than crashing
                delete bookingDetailsToSend.coachId; 
            }

            await createBooking(bookingDetailsToSend);
            
            alert('Booking confirmed successfully!');
            setBooking(initialBookingState);
        } catch (err) {
            setError(err.message || 'Failed to complete booking. Please check the server terminal for Mongoose errors.');
        } finally {
            setLoading(false);
        }
    };

    // --- 4. Render UI ---
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Court Booking</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date and Time Selector (Time Slot Selector) */}
                <input type="date" name="date" value={booking.date} onChange={handleChange} required />
                <input type="time" name="startTime" value={booking.startTime} onChange={handleChange} required />
                <input type="time" name="endTime" value={booking.endTime} onChange={handleChange} required />

                {/* Court Selector */}
                <select name="courtId" value={booking.courtId} onChange={handleChange} required className="w-full p-2 border rounded">
                    <option value="">Select a Court</option>
                    {courts.map(court => (
                        <option key={court._id} value={court._id}>{court.name} ({court.type})</option>
                    ))}
                </select>

                {/* Coach and Equipment Selectors */}
                <label className="block">
                    Add Rackets:
                    <input type="number" name="rackets" value={booking.rackets} onChange={handleChange} min="0" className="ml-2 border rounded p-1" />
                </label>
                <label className="block">
                    Add Coach:
                    <select name="coachId" value={booking.coachId} onChange={handleChange} className="ml-2 border rounded p-1">
                        <option value="">No Coach</option>
                        {coaches.map(coach => (
                            <option key={coach._id} value={coach._id}>
                                {coach.name} (${coach.hourlyRate}/hr)
                            </option>
                        ))}
                    </select>
                </label>

                {/* Live Price Display */}
                <div className="p-4 border-t-2 border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Live Price Breakdown</h2>
                    {loading && <p>Calculating price...</p>}
                    {priceBreakdown ? (
                        <ul className="text-gray-700">
                            {/* Ensure optional chaining for robust rendering */}
                            <li>Court Fee: ${priceBreakdown.baseCourtFee?.toFixed(2) || '0.00'}</li> 
                            {priceBreakdown.baseCoachFee > 0 && 
                              <li>Coach Fee: ${priceBreakdown.baseCoachFee?.toFixed(2) || '0.00'}</li>}
                            {priceBreakdown.equipmentFee > 0 && 
                              <li>Equipment Fee: ${priceBreakdown.equipmentFee?.toFixed(2) || '0.00'}</li>}
                            {priceBreakdown.rulesFee !== 0 && 
                              <li>*Rules Modifier: ${priceBreakdown.rulesFee?.toFixed(2) || '0.00'}</li>}
                            <li className="font-bold text-lg text-green-600">
                                Total: ${priceBreakdown.total?.toFixed(2) || '0.00'}
                            </li>
                        </ul>
                    ) : <p>Select court and time to see price.</p>}
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !priceBreakdown} 
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Book Court'}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;