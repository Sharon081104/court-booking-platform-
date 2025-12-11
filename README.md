📂 Court Booking Platform
This is a full-stack web application designed for booking sports courts, coaches, and related equipment.

🌐 Project Architecture
The application is structured as a Monorepo containing two main services:

backend/: Node.js/Express API (Handles routing, business logic, Mongoose/MongoDB interaction, and availability checks).

frontend/: React Single Page Application (SPA) (Handles user interface, state management, and API communication).

🛠️ Setup and Installation
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (v18+) and npm

MongoDB (A local instance or a cloud service like MongoDB Atlas)

1. Clone the Repository
Bash

git clone https://github.com/Sharon081104/court-booking-platform-.git
cd court-booking-platform-
2. Configure Environment Variables
Create a file named .env in the backend directory (i.e., backend/.env).

# backend/.env file

# MongoDB Connection String (Replace <password> and <dbname>)
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"

# JWT Secret for user authentication (optional, if you implement login)
JWT_SECRET="your_strong_secret_key" 

# Server Port
PORT=5000
3. Install Dependencies
Install dependencies separately for the backend and frontend.

Bash

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
4. Run the Application
Start the Backend API:

Bash

cd ../backend
npm start  # Or nodemon server.js
The API will run on http://localhost:5000

Start the Frontend Client:

Bash

cd ../frontend
npm start
The client will open in your browser at http://localhost:3000

⚙️ Key Assumptions Made
The following assumptions and design decisions were made during development and are crucial for the application to function correctly:

Monorepo Structure: The project uses a Monorepo, meaning the deployment process requires specifying the frontend and backend subfolders as the root directories for their respective hosts (Vercel and Render).

Date/Time Handling: All date and time logic (including availability overlap checks) relies on the server-side processing using the Date() constructor. It is assumed that all dates are stored and handled consistently (e.g., as UTC or with explicit timezone handling if required).

Pricing Logic: The core pricing rules are encapsulated in the external utility: backend/utils/priceCalculator.js. This utility must return an object with a total number field and a detailed priceDetails object, as required by the Mongoose schema for the priceDetails sub-document.

Admin Dashboard URL: The frontend Admin Dashboard assumes the endpoint for fetching all bookings is located at /api/bookings/admin.

Equipment Stock: It is assumed that equipment stock is stored in a single document in the Equipment collection.

User Authentication: User and Admin roles are required for full functionality (e.g., createBooking requires a userId, and getAllBookings requires an Admin role check in middleware, which is assumed to be implemented in the routes).

🚀 Deployment
The project is designed for separate deployment:

Frontend (React): Deployed on Vercel (Root Directory: frontend).

Backend (Node/Express): Deployed on Render (Root Directory: backend).

Ensure the baseURL in frontend/src/apiService.js is updated to the live Render URL before deploying the frontend.
