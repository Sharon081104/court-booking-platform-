import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/apiService';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await getAllBookings();
                setBookings(data);
            } catch (err) {
                setError(err.message || "Failed to fetch bookings.");
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    if (loading) return <div className="p-6 text-center">Loading Admin Data...</div>;
    if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="p-8 bg-white shadow-2xl rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All System Bookings ({bookings.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Client</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Court</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date / Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking._id.substring(0, 5)}...</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.clientName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600">{booking.courtId}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-700">${booking.priceDetails?.total?.toFixed(2) || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;