import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-indigo-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Sports Booking
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-indigo-200 transition duration-150">
            Book Now
          </Link>
          <Link to="/admin" className="text-white hover:text-indigo-200 transition duration-150">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;