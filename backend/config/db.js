// C:\Users\Sharon\Documents\project assignment\root\backend\config\db.js

// FIX 1: Change CJS 'require' to ESM 'import'
import mongoose from 'mongoose';
// Assuming you use dotenv for environment variables (already imported in server.js)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

// FIX 2: Replace 'module.exports = connectDB;' with 'export default connectDB;'
export default connectDB;