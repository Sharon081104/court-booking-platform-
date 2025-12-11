import React, { useState, useEffect } from 'react';
import { checkPrice, createBooking } from '../services/apiService';
const BookingForm = ({ bookingDetails }) => {
    // State for user input fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // State for dynamic price display
    const [price, setPrice] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [priceError, setPriceError] = useState(null);
    
    // State for form submission status
    const [submissionStatus, setSubmissionStatus] = useState(null);

    // Effect to calculate price whenever the selected slot (bookingDetails) changes
    useEffect(() => {
        if (bookingDetails) {
            const calculatePrice = async () => {
                setPriceLoading(true);
                setPriceError(null);
                setPrice(null);

                try {
                    // Call the backend API endpoint from Phase 4
                    const finalPrice = await checkPrice(bookingDetails);
                    setPrice(finalPrice);
                } catch (error) {
                    setPriceError("Failed to calculate price. Check backend logs.");
                } finally {
                    setPriceLoading(false);
                }
            };
            calculatePrice();
        }
    }, [bookingDetails]); // Reruns whenever a new slot is selected

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission (booking creation)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        setPriceError(null); // Clear previous errors

        if (!price) {
            setSubmissionStatus(null);
            alert("Price calculation pending. Please wait.");
            return;
        }

        const fullBooking = {
            ...bookingDetails, // courtId, time, date
            ...formData,      // name, email, phone
            finalPrice: price, // Re-verified price
        };

        try {
            const result = await createBooking(fullBooking); // <-- ACTUAL API CALL
            
            setSubmissionStatus('success');
            console.log("Booking Success:", result);
            // Optional: You could show the booking ID here
            
        } catch (error) {
            setSubmissionStatus('failed');
            setPriceError(error.message); // Display the backend error message
        }
    };

    if (!bookingDetails) {
        return (
            <div className="p-6 text-center text-gray-500">
                Please select a time slot to proceed with booking.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">Booking Details</h3>
            <p className="text-sm text-gray-700">
                Court ID: **{bookingDetails.courtId}** | Time: **{bookingDetails.time}**
            </p>

            {/* Price Calculation Display */}
            <div className={`p-3 rounded-lg ${priceError ? 'bg-red-100 text-red-700' : price ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}>
                <p className="font-semibold">Estimated Price:</p>
                {priceLoading && <p className="mt-1">Calculating...</p>}
                {priceError && <p className="mt-1">Error: {priceError}</p>}
                {price && <p className="text-2xl font-extrabold mt-1">${price.toFixed(2)}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={priceLoading || submissionStatus === 'submitting' || !price}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {submissionStatus === 'submitting' ? 'Processing...' : `Confirm Booking`}
                </button>

                {submissionStatus === 'success' && (
                    <div className="text-center p-3 bg-green-100 text-green-700 rounded-md">
                        Booking successfully created!
                    </div>
                )}
            </form>
        </div>
    );
};

export default BookingForm;