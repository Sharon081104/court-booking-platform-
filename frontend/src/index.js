// C:\Users\Sharon\Documents\project assignment\root\frontend\src\index.js

// --- 1. Imports ---
// We import createRoot from 'react-dom/client' for React 18+
import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import './index.css'; // Assuming you have a global CSS file

// --- 2. Application Root Setup ---

// Get the main HTML container element (usually the one with id="root")
const container = document.getElementById('root');

// Ensure the container exists before creating the root
if (container) {
    // Create the root object using the new React 18 API
    const root = createRoot(container);

    // Render the main App component into the root
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element with id="root" in the HTML.');
}
