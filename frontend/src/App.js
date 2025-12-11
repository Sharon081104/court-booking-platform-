import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Assuming your primary styling is here

// --- Component Imports ---
// Ensure these files exist in the './pages/' or './components/' folders
// and use the 'export default ComponentName;' syntax at the bottom.

// Page Components
import BookingPage from './pages/BookingPage';
import AdminHome from './pages/AdminHome'; // Placeholder for admin section

// Layout/Navigation Components
import Navigation from './components/Navigation';

function App() {
  return (
    // Router wraps the entire application
    <Router>
      {/* Navigation is rendered outside the <Routes> so it appears on all pages */}
      <Navigation /> 
      
      <main className="container mx-auto p-4">
        <Routes>
          {/* Main Route for the Court Booking Feature */}
          <Route path="/" element={<BookingPage />} /> 

          {/* Route for the admin dashboard (e.g., managing users, pricing rules) */}
          <Route path="/admin" element={<AdminHome />} />
          
          {/* Add other public or user routes here */}
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;