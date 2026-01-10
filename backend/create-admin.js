import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';

dotenv.config();

connectDB();

const createAdmin = async () => {
    try {
        const userExists = await User.findOne({ username: 'admin' });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create({
            username: 'admin',
            password: 'admin', // Will be hashed by pre-save middleware
            role: 'admin',
        });

        console.log('Admin user created successfully');
        console.log(`Username: ${user.username}`);
        console.log('Password: admin (hashed)');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
