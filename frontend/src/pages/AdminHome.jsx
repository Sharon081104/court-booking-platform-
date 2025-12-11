import React from 'react';
import BookingList from '../components/Admin/BookingList';

const AdminHome = () => {
    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-red-700">
                Admin Dashboard
            </h1>
            
            <BookingList />
            
        </div>
    );
};

export default AdminHome;