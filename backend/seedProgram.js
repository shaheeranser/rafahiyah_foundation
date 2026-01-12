import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from './models/programModel.js';
import connectDB from './config/db.js';

dotenv.config();

const seedProgram = async () => {
    try {
        await connectDB();

        const sampleProgram = {
            title: "Test Program from Database",
            venue: "Digital Campus",
            description: "This is a test program to verify database connection and frontend display. If you see this, the fetch is working!",
            startingDate: new Date(),
            endingDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            linkedEvents: [],
            linkedCases: []
        };

        const createdProgram = await Program.create(sampleProgram);
        console.log('Sample program created:', createdProgram);

        console.log('Seeding completed. Press Ctrl+C to exit if it does not automatically.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding program:', error);
        process.exit(1);
    }
};

seedProgram();
